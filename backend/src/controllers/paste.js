import { nanoid } from "nanoid";
import { redis } from "../db/redis.js";

export const createPaste = async (req, res) => {
  try {
    const { content, ttlSeconds, maxViews } = req.body;
    const id = nanoid(8);

    // Generate ID
    const now = Date.now();
    const expiresAt = ttlSeconds ? now + ttlSeconds * 1000 : null;

    //Store in Redis
    const pasteKey = `paste:${id}`;

    const pasteData = {
      content,
      createdAt: now,
      expiresAt,
      maxViews: maxViews ?? null,
      view: 0,
    };

    await redis.set(pasteKey, JSON.stringify(pasteData));

    return res.status(200).json({
      id,
      url: `${process.env.BASE_URL}/p/${id}`,
    });
  } catch (error) {
    console.error("Create paste error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
