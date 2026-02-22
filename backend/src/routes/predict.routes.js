import express from "express";
import { predictHandler } from "../controllers/predict.controller.js";

const router = express.Router();

router.post("/predict", predictHandler);

export default router;