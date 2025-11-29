import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";

const router = express.Router();

// Registro de usuario
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id,name,email",
            [name, email, hashed]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error en registro:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (user.rows.length === 0) return res.status(400).json({ error: "Usuario no encontrado" });

        const valid = await bcrypt.compare(password, user.rows[0].password);
        if (!valid) return res.status(400).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email } });
    } catch (error) {
        console.error("Error en login:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
