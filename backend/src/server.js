import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import predictRoutes from "./routes/predict.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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