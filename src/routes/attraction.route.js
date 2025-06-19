import express from 'express';
import { importAttractions, getAttractions, getAttractionById, createAttraction, updateAttraction, deleteAttraction, getAttractionsByCategorySearch } from '../controller/parse.attraction.controller.js';
const router = express.Router();

// Route to read and insert attractions from CSV
router.get('/import-attractions', importAttractions);
router.get('/attractions', getAttractions)
router.get('/attractions/:id', getAttractionById);
router.post('/createattraction', createAttraction);
router.patch('/:id', updateAttraction)
router.delete('/:id', deleteAttraction)
router.get('/search', getAttractionsByCategorySearch);
export default router;
