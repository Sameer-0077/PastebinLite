import express from "express";
import { viewPaste } from "../controllers/paste.js";

const router = express.Router();

router.get("/p/:id", viewPaste);

export default router;
