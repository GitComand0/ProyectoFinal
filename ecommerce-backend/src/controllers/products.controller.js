import db from "../db.js";

export const getProducts = async (req, res) => {
    try {
        const q = req.query.q;
        let base = "SELECT * FROM products";
        const params = [];
        if (q) {
            base += " WHERE LOWER(title) LIKE $1 OR LOWER(description) LIKE $1";
            params.push(`%${q.toLowerCase()}%`);
        }
        const { rows } = await db.query(base, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener productos" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query("SELECT * FROM products WHERE id = $1", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener producto" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { title, price, category, rating, img, description } = req.body;
        const result = await db.query(
            `INSERT INTO products (title, price, category, rating, img, description)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [title, price, category, rating, img, description]
        );
        res.json({ message: "Producto creado", product: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear producto" });
    }
};
