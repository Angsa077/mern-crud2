import express from "express";
import { verifyUser } from "../middleware/AuthUser.js";
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/UserController.js";

const router = express.Router();

// Menggunakan middleware verifyUser untuk melindungi rute-rute ini
router.get('/users', verifyUser, getUsers);
router.get('/users/:id', verifyUser, getUserById);
router.put('/users/:id', verifyUser, updateUser);
router.delete('/users/:id', verifyUser, deleteUser);

export default router;
