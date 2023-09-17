import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        if (users.length === 0) {
            return res.status(404).json({ msg: "Data user masih kosong" });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.params.id
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "Data user yang anda cari tidak ada" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await argon2.hash(password);

        const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
                id: { not: req.params.id }
            }
        });

        if (existingUser) {
            return res.status(400).json({ msg: "Email ini sudah digunakan" });
        }

        const user = await prisma.user.update({
            where: {
                id: req.params.id
            },
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        });

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}


const deleteUser = async (req, res) => {
    try {
        await prisma.user.delete({
            where: {
                id: req.params.id
            }
        });

        res.status(200).json({ msg: "Data user berhasil dihapus" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export { getUsers, getUserById, updateUser, deleteUser }