// routes/orders.js
import express from "express";
import pool from "../db/index.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware para verificar token
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No autorizado" });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido" });
    }
};

// Crear orden
router.post("/", auth, async (req, res) => {
    const { items, subtotal, shipping, total, address, city, postal, country } = req.body;
    try {
        const orderRes = await pool.query(
            `INSERT INTO orders 
       (customer_name, customer_email, address, city, postal, country, subtotal, shipping, total)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
            [req.user.id, req.user.id, address, city, postal, country, subtotal, shipping, total]
        );
        const orderId = orderRes.rows[0].id;

        for (let item of items) {
            await pool.query(
                `INSERT INTO order_items (order_id, product_id, product_title, unit_price, qty)
         VALUES ($1,$2,$3,$4,$5)`,
                [orderId, item.id, item.title, item.price, item.qty]
            );
        }

        res.json({ message: "Orden creada", orderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear orden" });
    }
});

// Obtener órdenes del usuario
router.get("/my", auth, async (req, res) => {
    try {
        const ordersRes = await pool.query("SELECT * FROM orders WHERE customer_name = $1", [req.user.id]);
        res.json(ordersRes.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener órdenes" });
    }
});

export default router;
