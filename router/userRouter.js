import express from "express";
import { addNewAdmin, login, Register } from "../controller/userController.js";

const router = express.Router();

router.post("/client/register",Register);
router.post("/login",login);
router.post("/admin/addnew",addNewAdmin);

export default router; 