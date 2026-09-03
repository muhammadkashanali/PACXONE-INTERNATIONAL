import Category from "../models/Category.js";

export const getCategoriesService = async () => {
  return await Category.find().sort({
    parentCategory: 1,
    sortOrder: 1,
    createdAt: -1,
  });
};

export const createCategoryService = async ({
  name,
  description,
  image,
  slug,
  parentCategory,
  sortOrder,
  isActive,
}) => {
  const normalizedSlug = String(slug).trim().toLowerCase();

  const exists = await Category.findOne({
    slug: normalizedSlug,
  });

  if (exists) {
    const error = new Error("Category slug already exists");
    error.statusCode = 400;
    throw error;
  }

  return await Category.create({
    name,
    description: description || "",
    image: image || "",
    slug: normalizedSlug,
    parentCategory: parentCategory || null,
    sortOrder: Number(sortOrder) || 0,
    isActive: isActive !== false,
  });
};

export const updateCategoryService = async (
  categoryId,
  {
    name,
    description,
    image,
    slug,
    parentCategory,
    sortOrder,
    isActive,
  }
) => {
  const payload = {
    ...(name ? { name } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(image !== undefined ? { image } : {}),
    ...(slug
      ? {
          slug: String(slug).trim().toLowerCase(),
        }
      : {}),
    ...(parentCategory !== undefined
      ? {
          parentCategory: parentCategory || null,
        }
      : {}),
    ...(sortOrder !== undefined
      ? {
          sortOrder: Number(sortOrder) || 0,
        }
      : {}),
    ...(isActive !== undefined ? { isActive } : {}),
  };

  return await Category.findByIdAndUpdate(
    categoryId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteCategoryService = async (categoryId) => {
  return await Category.findByIdAndDelete(categoryId);
};

