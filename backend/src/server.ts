import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./modules/auth/auth.routes.js";
import schedulingRoutes from "./modules/scheduling/scheduling.routes.js";
import masterdataRoutes from "./modules/masterdata/masterdata.routes.js";
import { seedFirestore } from "./lib/firestore.js";

const app = express();

// 🔥 HAMMA ORIGINLARGA RUXSAT
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "tatu-smart-scheduler-firestore" });
});

app.use("/api/auth", authRoutes);
app.use("/api/masterdata", masterdataRoutes);
app.use("/api/scheduling", schedulingRoutes);

// ✅ Render uchun
const PORT = env.port || 10000;

app.listen(PORT, "0.0.0.0", async () => {
  try {
    await seedFirestore(false);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("✅ Firestore connected.");
  } catch (error: any) {
    console.error("⚠️ Firestore error:", error?.message || error);
  }
});