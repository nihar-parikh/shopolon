import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.js";
import { authorisedRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/products/new",
  isAuthenticatedUser,
  authorisedRoles("admin"),
  createProduct
);
router.get("/products", getAllProducts);
router.put(
  "/products/:productId",
  isAuthenticatedUser,
  authorisedRoles("admin"),
  updateProduct
);
router.get("/products/:productId", getSingleProduct);
router.delete(
  "/products/:productId",
  isAuthenticatedUser,
  authorisedRoles("admin"),
  deleteProduct
);

export default router;
