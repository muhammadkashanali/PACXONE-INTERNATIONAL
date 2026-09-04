import {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "../services/productService.js";

export const getProducts = async (_req, res, next) => {
  try {
    const products = await getProductsService();

    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await getProductByIdService(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      model,
      slug,
      categoryId,
      description,
      image,
      datasheet,
      features,
      applications,
      specs,
      availability,
      featured,
      isPublished,
    } = req.body;

    if (
      !name ||
      !brand ||
      !model ||
      !categoryId ||
      !description
    ) {
      return res.status(400).json({
        message:
          "Name, brand, model, category, and description are required",
      });
    }

    const product = await createProductService({
      name,
      brand,
      model,
      slug,
      categoryId,
      description,
      image,
      datasheet,
      features,
      applications,
      specs,
      availability,
      featured,
      isPublished,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await updateProductService(
      req.params.id,
      req.body
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await deleteProductService(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
