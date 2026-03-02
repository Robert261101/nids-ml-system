import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import predictRoutes from "./routes/predict.routes.js";
import { requestId } from "./middlewares/requestId.middleware.js";
import { applySecurity } from "./security.js";

dotenv.config();

const app = express();

applySecurity(app);
app.use(cors());
app.use(express.json());
app.use(requestId);

// Health route
app.get("/health", (req, res) => {
  res.json({ status: "backend ok" });
});

// Predict routes
app.use("/api", predictRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});