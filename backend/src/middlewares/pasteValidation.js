export const pasteValidation = (req, res, next) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ error: "content is requied" });
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return res
        .status(400)
        .json({ error: "ttl_seconds must be an Ineteger and greater than 0" });
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return res
        .status(400)
        .json({ error: "max_views must be an Integer and greater than 0" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
