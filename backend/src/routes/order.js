import express from "express";
import {
  allOrders,
  createNewOrder,
  deleteOrder,
  getSingleOrder,
  myOrders,
  updateOrder,
} from "../controllers/order.js";

import { authorisedRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();
router.post("/order/new", isAuthenticatedUser, createNewOrder);
router.get("/order/:orderId", isAuthenticatedUser, getSingleOrder);
router.get("/orders/me", isAuthenticatedUser, myOrders);
router.get(
  "/admin/orders/all",
  isAuthenticatedUser,
  authorisedRoles(["admin"]),
  allOrders
);
router.put(
  "/admin/order/:orderId",
  isAuthenticatedUser,
  authorisedRoles(["admin"]),
  updateOrder
);
router.delete(
  "/admin/order/:orderId",
  isAuthenticatedUser,
  authorisedRoles(["admin"]),
  deleteOrder
);

export default router;
