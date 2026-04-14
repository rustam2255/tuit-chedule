import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./modules/auth/auth.routes.js";
import schedulingRoutes from "./modules/scheduling/scheduling.routes.js";
import masterdataRoutes from "./modules/masterdata/masterdata.routes.js";
import { seedFirestore } from "./lib/firestore.js";

const app = express();
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "tatu-smart-scheduler-firestore" });
});

app.use("/api/auth", authRoutes);
app.use("/api/masterdata", masterdataRoutes);
app.use("/api/scheduling", schedulingRoutes);

app.listen(env.port, async () => {
  try {
    await seedFirestore(false);
    console.log(`Server running on http://localhost:${env.port}`);
    console.log("Firestore connected and seed checked.");
  } catch (error: any) {
    console.error("Server started, but Firestore seed failed:", error?.message || error);
  }
});
