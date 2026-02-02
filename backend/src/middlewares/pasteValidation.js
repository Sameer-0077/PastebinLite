export const pasteValidation = (req, res, next) => {
  try {
    const { content, ttlSeconds, maxViews } = req.body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ error: "content is requied" });
    }

    if (
      ttlSeconds !== undefined &&
      (!Number.isInteger(ttlSeconds) || ttlSeconds < 1)
    ) {
      return res
        .status(400)
        .json({ error: "ttlSeconds must be an Ineteger and greater than 0" });
    }

    if (
      maxViews !== undefined &&
      (!Number.isInteger(maxViews) || maxViews < 1)
    ) {
      return res
        .status(400)
        .json({ error: "maxViews must be an Integer and greater than 0" });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error", errorMsg: error.message });
  }
};
