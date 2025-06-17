import express from 'express';
import { getCategoryByIdController, getAllCategory, createCategoryController, updateCategoryController, deleteCategoryController } from '../controller/attraction.category.controller.js';
const router = express.Router();

router.get('/', getAllCategory);
router.get("/:id", getCategoryByIdController)
router.post('/', createCategoryController)
router.put('/:id', updateCategoryController);
router.delete("/:id", deleteCategoryController)


export default router;