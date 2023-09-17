import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const verifyUser = async (req, res, next) => {
    try {
        // Mendapatkan token dari header permintaan dengan metode "Bearer"
        const authorizationHeader = req.header('Authorization');
        
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Silakan masukkan token Bearer' });
        }

        // Mengambil token dari header
        const token = authorizationHeader.split(' ')[1];

        // Verifikasi token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Mengambil ID pengguna dari payload token
        const userId = decoded.userId;

        // Melakukan pemeriksaan apakah pengguna ada dalam database atau tidak
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(401).json({ error: 'Pengguna tidak ditemukan' });
        }

        // Menyimpan informasi pengguna dalam objek permintaan
        req.user = user;

        // Melanjutkan ke middleware atau rute berikutnya
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ error: 'Token tidak valid' });
    }
};

export { verifyUser };
