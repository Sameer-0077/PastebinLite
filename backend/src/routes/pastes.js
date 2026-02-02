import express from "express";
import { pasteValidation } from "../middlewares/pasteValidation.js";
import { createPaste } from "../controllers/paste.js";

const router = express.Router();

router.post("/pastes", pasteValidation, createPaste);

export default router;
