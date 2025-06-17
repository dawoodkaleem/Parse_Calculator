import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  en_name: {
    type: String,
    required: true,
  },
  de_name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model('Category', CategorySchema);

export default Category;
