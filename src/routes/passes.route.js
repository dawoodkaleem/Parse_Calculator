import express from 'express';
import { importPasses, getCheapestPass, countPassOccurrences, getAllPasses } from '../controller/passes.controller.js';

const router = express.Router();

// Route for passes
router.get('/import-passes', importPasses);
router.post('/cheapestpass', getCheapestPass)
router.post('/occurPasses', countPassOccurrences)
router.get('/getpasses', getAllPasses);
export default router;