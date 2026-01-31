import express from "express";

const router = express.Router();

router.get("/helthz", async (req, res) => {
  return res.status(200).json({ ok: true });
});

export default router;
