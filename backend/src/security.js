import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

export function applySecurity(app) {
  app.use(helmet());

  app.use(cors({
    origin: true, // tighten later (set your frontend origin)
    credentials: false,
  }));

  app.use(rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
  }));
}