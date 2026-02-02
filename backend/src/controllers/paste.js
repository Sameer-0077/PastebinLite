import { nanoid } from "nanoid";
import { redis } from "../db/redis.js";
import { getNow } from "../utils/time.js";
import { escapeHtml } from "../utils/escapeHtml.js";

export const createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;
    const id = nanoid(8);

    // Generate ID
    const now = Date.now();
    const expires_at = ttl_seconds ? now + ttl_seconds * 1000 : null;

    //Store in Redis
    const pasteKey = `paste:${id}`;

    const pasteData = {
      content,
      createdAt: now,
      expires_at,
      max_views: max_views ?? null,
      views: 0,
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

export const getPaste = async (req, res) => {
  try {
    const { id } = req.params;
    const pasteKey = `paste:${id}`;

    const rawPaste = await redis.get(pasteKey);

    // If no paste availble
    if (!rawPaste) {
      return res.status(404).json({ error: "Paste not found" });
    }

    const paste =
      typeof rawPaste === "string" ? JSON.parse(rawPaste) : rawPaste;
    const now = getNow(req);

    // Check TTL
    if (paste.expires_at && now >= paste.expires_at) {
      await redis.del(pasteKey);
      return res.status(404).json({ error: "Paste expired" });
    }

    // Check view limits
    if (paste.max_views !== null && paste.views >= paste.max_views) {
      await redis.del(pasteKey);
      return res.status(404).json({ error: "View limit exceeded" });
    }

    // Increment view
    paste.views += 1;

    await redis.set(pasteKey, JSON.stringify(paste));

    // Calculate remaining views
    const remaining_views =
      paste.max_views !== null
        ? Math.max(paste.max_views - paste.views, 0)
        : null;

    return res.status(200).json({
      content: paste.content,
      remaining_views,
      expires_at: paste.expires_at,
    });
  } catch (error) {
    console.error("Get paste error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", errorMsg: error.message });
  }
};

export const viewPaste = async (req, res) => {
  try {
    const { id } = req.params;
    const pasteKey = `paste:${id}`;

    const rawPaste = await redis.get(pasteKey);

    if (!rawPaste) {
      return res.status(404).send("Paste not found");
    }

    const paste =
      typeof rawPaste === "string" ? JSON.parse(rawPaste) : rawPaste;

    const now = getNow(req);

    // Check TTL
    if (paste.expires_at && now >= paste.expires_at) {
      await redis.del(pasteKey);
      return res.status(404).send("Paste expired");
    }

    // Check view limits
    if (paste.max_views !== null && paste.views >= paste.max_views) {
      await redis.del(pasteKey);
      return res.status(404).send("Paste unavailbale");
    }

    const safeContent = escapeHtml(paste.content);

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Paste ${id}</title>
          <style>
            body {
              font-family: monospace;
              padding: 20px;
              background: #f6f8fa;
            }
            pre {
              background: #fff;
              padding: 16px;
              border-radius: 6px;
              white-space: pre-wrap;
              word-break: break-word;
            }
          </style>
        </head>
        <body>
          <pre>${safeContent}</pre>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("View paste error:", error);
    return res.status(500).send("Internal server error");
  }
};
