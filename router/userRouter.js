import express from "express";
import { addNewAdmin, getAllCourts, getUserDetails, login, logoutAdmin, logoutUser, Register } from "../controller/userController.js";
import { isAdminAuthenticated, isUserAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/client/register",Register);
router.post("/login",login);
router.post("/admin/addnew",isAdminAuthenticated, addNewAdmin);
router.get("/courts", getAllCourts);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/user/me", isUserAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/user/logout", isUserAuthenticated, logoutUser);


export default router; 