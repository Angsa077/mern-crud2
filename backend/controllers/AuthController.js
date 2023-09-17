import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validasi password (minimal 8 karakter, campur huruf dan angka)
        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
        if (!password.match(passwordRegex)) {
            return res.status(400).json({ msg: "Password harus minimal 8 karakter dan mengandung huruf dan angka" });
        }

        // Validasi konfirmasi password
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Konfirmasi password tidak cocok" });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(400).json({ msg: "Email sudah digunakan" });
        }

        const hashedPassword = await argon2.hash(password);

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "Email atau password salah" });
        }

        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Email atau password salah" });
        }

        const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m', 
        });

        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d', 
        });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const logout = async (req, res) => {

}

export { loginUser, registerUser, logout };