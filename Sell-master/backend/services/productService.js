import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const getProductsService = async () => {
  const products = await Product.find({
    isPublished: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  const categories = await Category.find({}).lean();

  const categoryMap = Object.fromEntries(
    categories.map((category) => [
      String(category._id),
      category,
    ])
  );

  return products.map((product) => ({
    ...product,

    category:
      categoryMap[String(product.category)] || null,

    categoryId:
      product.categoryId ||
      (product.category
        ? categoryMap[String(product.category)]?.slug
        : ""),
  }));
};

export const getProductByIdService = async (productId) => {
  return await Product.findById(productId);
};

export const createProductService = async ({
  name,
  brand,
  model,
  slug,
  categoryId,
  description,
  image,
  features,
  applications,
  specs,
  availability,
  featured,
  isPublished,
}) => {
  const productSlug =
    slug || name.toLowerCase().replace(/\s+/g, "-");

  const duplicate = await Product.findOne({
    slug: productSlug,
  });

  if (duplicate) {
    const error = new Error("Product slug already exists");
    error.statusCode = 400;
    throw error;
  }

  return await Product.create({
    name,
    brand,
    model,
    slug: productSlug,
    categoryId,
    description,
    image: image || "",
    features: features || [],
    applications: applications || [],
    specs: specs || [],
    availability: availability || "In Stock",
    featured: Boolean(featured),
    isPublished: isPublished !== false,
  });
};

export const updateProductService = async (
  productId,
  updateData
) => {
  return await Product.findByIdAndUpdate(
    productId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteProductService = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};
