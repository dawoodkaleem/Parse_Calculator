import Category from '../models/attraction.categorie.js';

export const getAllCategories = async (lang = 'en') => {
  const categories = await Category.find();
  return categories.map(cat => ({
    _id: cat._id,
    name: lang === 'de' ? cat.de_name : cat.en_name,
  }));
};

export const getCategoryById = async (id, lang = 'en') => {
  const category = await Category.findById(id);
  if (!category) return null;
  return {
    _id: category._id,
    name: lang === 'de' ? category.de_name : category.en_name,
  };
};

export const createCategory = async (en_name, de_name) => {
  const existing = await Category.findOne({ en_name, de_name });
  if (existing) return { exists: true };

  const newCategory = new Category({ en_name, de_name });
  await newCategory.save();
  return { category: newCategory };
};

export const updateCategory = async (id, en_name, de_name) => {
  const category = await Category.findById(id);
  if (!category) return null;

  const updated = await Category.findByIdAndUpdate(id, { en_name, de_name }, { new: true });
  return updated;
};

export const deleteCategory = async (id) => {
  const deleted = await Category.findByIdAndDelete(id);
  return deleted;
};
