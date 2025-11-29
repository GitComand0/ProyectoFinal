import db from "../db.js";

export const createOrder = async (req, res) => {
    try {
        const { name, email, address, city, postal, country, items, subtotal, shipping, total } = req.body;

        const orderRes = await db.query(
            `INSERT INTO orders (customer_name, customer_email, address, city, postal, country, subtotal, shipping, total)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [name, email, address, city, postal, country, subtotal, shipping, total]
        );

        const order = orderRes.rows[0];

        // Insert items
        for (const it of items) {
            await db.query(
                `INSERT INTO order_items (order_id, product_id, product_title, unit_price, qty)
         VALUES ($1,$2,$3,$4,$5)`,
                [order.id, it.id, it.title || it.product_title, it.price || it.unit_price, it.qty]
            );
        }

        res.json({ message: "Orden creada", orderId: order.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear orden" });
    }
};

export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows: orders } = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
        if (orders.length === 0) return res.status(404).json({ error: "Orden no encontrada" });
        const order = orders[0];
        const { rows: items } = await db.query("SELECT * FROM order_items WHERE order_id = $1", [id]);
        res.json({ order, items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener orden" });
    }
};
