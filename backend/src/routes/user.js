import express from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  getASingleUser,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updatePassword,
  updateUser,
  updateUserRole,
} from "../controllers/user.js";
import { authorisedRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:resetToken", resetPassword);
router.get("/me", isAuthenticatedUser, getUser);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/me/update", isAuthenticatedUser, updateUser);
router.get(
  "/admin/allUsers",
  isAuthenticatedUser,
  authorisedRoles(["admin"]),
  getAllUsers
);
router.get(
  "/admin/user/:userId",
  isAuthenticatedUser,
  authorisedRoles(["admin"]),
  getASingleUser
);
router.put(
  "/admin/user/:userId",
  isAuthenticatedUser,
  authorisedRoles(["admin"]),
  updateUserRole
);
router.delete(
  "/admin/user/:userId",
  isAuthenticatedUser,
  authorisedRoles(["admin"]),
  deleteUser
);

export default router;
