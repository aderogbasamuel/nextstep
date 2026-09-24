import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "nextstep-api"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`NextStep API running on port ${PORT}`);
});