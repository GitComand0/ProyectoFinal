import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando correctamente 🚀" });
});

// Obtener productos
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Crear producto
app.post("/products", async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
    });
    res.json(product);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Servidor backend corriendo en el puerto " + PORT);
});

