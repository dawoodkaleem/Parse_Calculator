import express from 'express';
import { getBestMatchingPasses } from '../controller/pass.attraction.controller.js';

const router = express.Router();

router.post('/match-passes', getBestMatchingPasses);

export default router;