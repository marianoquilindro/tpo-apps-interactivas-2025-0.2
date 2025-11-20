import "reflect-metadata";
import express from "express";
import cors from "cors"; 
import { AppDataSource } from "./data-source";

// Rutas
import usuarioRoutes from "./routes/usuarioRoutes";
import equipoRoutes from "./routes/equipoRoutes";
import tareasRoutes from "./routes/tareasRoutes";
import etiquetaRoutes from "./routes/etiquetasRoutes";
import actividadesRoutes from "./routes/actividadesRoutes";
import comentariosRoutes from "./routes/comentariosRoutes";
import notificacionesRoutes from "./routes/notificacionesRoutes";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());

// Rutas principales
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/equipos", equipoRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/etiquetas", etiquetaRoutes);
app.use("/api/notificaciones", notificacionesRoutes);

// Subrutas bajo /api/tareas
app.use("/api/tareas", comentariosRoutes);
app.use("/api/tareas", actividadesRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Conexión a la base de datos establecida.");
    app.listen(PORT, () =>
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}/api`)
    );
  })
  .catch((error) => console.error("❌ Error al iniciar TypeORM:", error));
