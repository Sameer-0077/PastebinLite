import express from "express";
import { pasteValidation } from "../middlewares/pasteValidation.js";
import { createPaste, getPaste } from "../controllers/paste.js";

const router = express.Router();

router.post("/pastes", pasteValidation, createPaste);
router.get("/pastes/:id", getPaste);

export default router;
