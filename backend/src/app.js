import "dotenv/config";

import express from "express";
import cors from "cors";
import helthzRoutes from "./routes/helthz.js";
import pastesRoutes from "./routes/pastes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", helthzRoutes);
app.use("/api", pastesRoutes);

app.get("/", (req, res) => {
  res.send("Pastebine app is running now!");
});

export default app;
