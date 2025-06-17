import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../services/category.services.js';

export const getAllCategory = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    if (!['en', 'de'].includes(lang)) {
      return res.status(400).json({ error: 'Invalid language. Use "en" or "de".' });
    }
    const categories = await getAllCategories(lang);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
};

export const getCategoryByIdController = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const category = await getCategoryById(req.params.id, lang);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category', details: error.message });
  }
};

export const createCategoryController = async (req, res) => {
  const { en_name, de_name } = req.body;
  if (!en_name || !de_name) {
    return res.status(400).json({ message: "Both en_name and de_name are required" });
  }

  try {
    const result = await createCategory(en_name, de_name);
    if (result.exists) {
      return res.status(409).json({ message: "Category already exists" });
    }
    res.status(200).json({ message: "Category created successfully", category: result.category });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
};

export const updateCategoryController = async (req, res) => {
  const { en_name, de_name } = req.body;
  const { id } = req.params;

  if (!en_name || !de_name) {
    return res.status(400).json({ message: "Both en_name and de_name are required" });
  }

  try {
    const updated = await updateCategory(id, en_name, de_name);
    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Updated successfully", category: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const deleted = await deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};
