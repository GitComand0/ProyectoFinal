import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import db from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/api/health", async (req, res) => {
    try {
        await db.query("SELECT 1");
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false });
    }
});

// routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
