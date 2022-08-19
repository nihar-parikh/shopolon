import express from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  deleteProductReviews,
  getAllProducts,
  getProductReviews,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.js";
import { authorisedRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/products/new",
  isAuthenticatedUser,
  authorisedRoles(["admin", "sub-admin"]),
  createProduct
);
router.get("/products", getAllProducts);
router.put(
  "/products/:productId",
  isAuthenticatedUser,
  authorisedRoles(["admin"]),
  updateProduct
);
router.get("/products/:productId", getSingleProduct);
router.delete(
  "/products/:productId",
  isAuthenticatedUser,
  authorisedRoles(["admin"]),
  deleteProduct
);
router.put(
  "/products/reviews/:productId",
  isAuthenticatedUser,
  createProductReview
);
router.get("/product/reviews/:productId", getProductReviews);
router.delete(
  "/product/reviews/:reviewId",
  isAuthenticatedUser,
  deleteProductReviews
);

export default router;
