import express from "express";
import { redis } from "../db/redis.js";

const router = express.Router();

router.get("/healthz", async (req, res) => {
  try {
    await redis.ping();
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
});

export default router;
