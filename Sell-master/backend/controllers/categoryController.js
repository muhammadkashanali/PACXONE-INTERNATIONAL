import {
  getCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/categoryService.js";

export const getCategories = async (_req, res, next) => {
  try {
    const categories = await getCategoriesService();

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const {
      name,
      description,
      image,
      slug,
      parentCategory,
      sortOrder,
      isActive,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        message: "Name and slug are required",
      });
    }

    const category = await createCategoryService({
      name,
      description,
      image,
      slug,
      parentCategory,
      sortOrder,
      isActive,
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await updateCategoryService(
      req.params.id,
      req.body
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await deleteCategoryService(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
