import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Plus, Minus, Search, Heart } from "lucide-react";
import './index.css';

// Productos
const PRODUCTS = [
  {
    id: "p1",
    title: "Pre-Workout Blast",
    price: 29.99,
    category: "Suplementos",
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b4f5f5d17f0b6b4d6a1b5b6d6c8c9e6",
    description:
      "Pre-workout energizante con cafeína natural, beta-alanina y aminoácidos para explosión de energía y enfoque.",
  },
  {
    id: "p2",
    title: "Protein Pro 2kg",
    price: 54.99,
    category: "Suplementos",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=aa2f0df6b9d6f0e5a4c3e3d7a9e9b8c1",
    description:
      "Proteína aislada de suero, 25g por porción, sabor neutro y chocolate. Ideal para recuperación muscular.",
  },
  {
    id: "p3",
    title: "Athletic Tee - Black",
    price: 24.99,
    category: "Ropa",
    rating: 4.4,
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=8b7f9b6c6f9c1234d7e6f8a1b2c3d4e5",
    description:
      "Camiseta deportiva transpirable, corte atlético. Te mantiene fresco durante entrenamientos intensos.",
  },
  {
    id: "p4",
    title: "Training Shorts - Grey",
    price: 27.5,
    category: "Ropa",
    rating: 4.2,
    img: "https://images.unsplash.com/photo-1520975918854-8f5f79b0d0de?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3cd6d7efb7a7c6e8b9f6a1e0d2c3b4a5",
    description:
      "Shorts ligeros con forro interno, bolsillo con cremallera y cintura elástica.",
  },
  {
    id: "p5",
    title: "BCAA Recovery",
    price: 19.99,
    category: "Suplementos",
    rating: 4.1,
    img: "https://images.unsplash.com/photo-1600180758890-8b5f1a8b7c2d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1f2e3d4c5b6a7d8e9f0a1b2c3d4e5f6a",
    description: "Aminoácidos esenciales para recuperación. Mezcla en agua post-entreno.",
  },
];

// Utilities
const currency = (n) => `$${n.toFixed(2)}`;

// LocalStorage keys
const CART_KEY = "gymstore_cart_v1";

// Main App
export default function App() {
  // UI state
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });
  const [showCart, setShowCart] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // carrito 1
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Lista
  const categories = useMemo(() => ["All", ...new Set(PRODUCTS.map((p) => p.category))], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      if (!q) return true;
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    });
  }, [query, category, maxPrice]);

  // Carrito
  const addToCart = (product, qty = 1) => {
    setCart((c) => {
      const current = { ...(c[product.id] || {}), ...product };
      const newQty = (c[product.id]?.qty || 0) + qty;
      return { ...c, [product.id]: { ...current, qty: newQty } };
    });
  };

  const setQty = (id, qty) => {
    setCart((c) => {
      if (!c[id]) return c;
      if (qty <= 0) {
        const copy = { ...c };
        delete copy[id];
        return copy;
      }
      return { ...c, [id]: { ...c[id], qty } };
    });
  };

  const clearCart = () => setCart({});

  const subtotal = Object.values(cart).reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal < 50 ? 5.99 : 0; // simple rule: free >$50
  const total = subtotal + shipping;

  // Checkout handler (simulado)
  //const handleCheckout = (form) => {
  // Enviar la orden al backend.
  //console.log("Checkout form:", form);
  // Simula éxito
  //setCheckoutOpen(false);
  //clearCart();
  //alert("¡Pedido realizado! (Simulación)");
  //};
  // Checkout handler (ahora envía al backend)
  const handleCheckout = async (form) => {
    try {
      // Construir items para enviar
      const items = Object.values(cart).map((it) => ({
        id: parseInt(it.id.replace("p", "")), // convierte 'p1' en 1
        title: it.title,
        price: it.price,
        qty: it.qty
      }));

      const payload = {
        name: form.name,
        email: form.email,
        address: form.address,
        city: form.city,
        postal: form.postal,
        country: form.country,
        items,
        subtotal,
        shipping,
        total
      };

      // POST al backend
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al crear orden");

      console.log("Orden creada:", data);
      alert(`¡Pedido realizado! ID: ${data.orderId}`);

      setCheckoutOpen(false);
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Error al enviar la orden: " + err.message);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-gray-800 text-gray-100 antialiased">
      <header className="max-w-7xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Gym<span className="text-amber-400">Store</span></h1>
            <span className="text-xs text-gray-400">Su tienda de suplementos y ropa deportiva</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-full">
            <Search size={16} />
            <input
              aria-label="Buscar productos"
              placeholder="Buscar suplementos, ropa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-64"
            />
          </div>

          <button
            onClick={() => setShowCart((s) => !s)}
            className="relative bg-gradient-to-br from-amber-400 to-orange-500 px-3 py-2 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transform transition"
            aria-label="Abrir carrito"
          >
            <ShoppingCart />
            <span className="font-semibold">Carrito</span>
            {Object.keys(cart).length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-6 h-6 flex items-center justify-center">
                {Object.values(cart).reduce((a, b) => a + b.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-12">
        <section className="grid md:grid-cols-4 gap-6">
          {/* Filtros */}
          <aside className="md:col-span-1 bg-slate-800/30 p-4 rounded-2xl backdrop-blur">
            <h3 className="text-lg font-semibold mb-3">Filtros</h3>

            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent border border-slate-700 p-2 rounded"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Precio máximo: {currency(maxPrice)}</label>
              <input
                type="range"
                min={0}
                max={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <button
                onClick={() => { setQuery(""); setCategory("All"); setMaxPrice(1000); }}
                className="w-full py-2 rounded bg-slate-700 hover:bg-slate-600 transition"
              >
                Limpiar filtros
              </button>
            </div>

            <div className="text-sm text-gray-400 mt-6">
              <p className="mb-1">Envío: calculado en el checkout</p>
              <p className="mb-1">Pagos seguros: Integrar Stripe/PayPal</p>
            </div>
          </aside>

          {/* Productos */}
          <div className="md:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Productos</h2>
              <div className="text-sm text-gray-400">Mostrando {filtered.length} resultado(s)</div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((p) => (
                  <motion.article
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gradient-to-b from-slate-800/60 to-slate-900 p-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition"
                  >
                    <div className="relative rounded-md overflow-hidden h-44">
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 bg-black/40 p-2 rounded-full">
                        <button title="Agregar a favoritos">
                          <Heart size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{p.title}</h3>
                        <p className="text-sm text-gray-400">{p.category} • ⭐ {p.rating}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{currency(p.price)}</div>
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="mt-2 px-3 py-1 rounded-full bg-amber-400 text-black font-semibold hover:scale-105 transition"
                        >
                          Añadir
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button onClick={() => setSelected(p)} className="text-sm text-slate-300 underline">
                        Ver detalles
                      </button>
                      <button onClick={() => { addToCart(p, 1); setShowCart(true); }} className="text-sm text-amber-300">
                        Comprar ahora
                      </button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* Barra */}
      <AnimatePresence>
        {showCart && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-6 top-16 w-96 bg-slate-900/90 rounded-2xl shadow-2xl p-4 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold">Tu Carrito</h4>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-400">Subtotal {currency(subtotal)}</div>
                <button onClick={() => setShowCart(false)} className="p-2 rounded-full bg-slate-800">
                  <X />
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-auto pr-2">
              {Object.values(cart).length === 0 ? (
                <div className="text-sm text-gray-400">Tu carrito está vacío.</div>
              ) : (
                Object.values(cart).map((it) => (
                  <div key={it.id} className="flex items-center gap-3 bg-slate-800/60 p-3 rounded">
                    <img src={it.img} alt={it.title} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{it.title}</div>
                      <div className="text-xs text-gray-400">{currency(it.price)} • {it.category}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setQty(it.id, it.qty - 1)} className="p-1 rounded-full bg-slate-700">
                          <Minus size={14} />
                        </button>
                        <div className="px-2">{it.qty}</div>
                        <button onClick={() => setQty(it.id, it.qty + 1)} className="p-1 rounded-full bg-slate-700">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-sm font-semibold">{currency(it.price * it.qty)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 border-t border-slate-700 pt-4">
              <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                <span>Subtotal</span>
                <span>{currency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                <span>Envío</span>
                <span>{currency(shipping)}</span>
              </div>

              <div className="flex items-center justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span>{currency(total)}</span>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={subtotal === 0}
                  onClick={() => setCheckoutOpen(true)}
                  className="flex-1 py-2 rounded-full bg-amber-400 text-black font-semibold hover:scale-105 transition disabled:opacity-50"
                >
                  Checkout
                </button>
                <button onClick={() => clearCart()} className="py-2 px-3 rounded-full bg-slate-700/60">
                  Limpiar
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative z-50 max-w-4xl w-full bg-slate-900 rounded-2xl p-6 shadow-2xl grid md:grid-cols-2 gap-6"
            >
              <div>
                <img src={selected.img} alt={selected.title} className="w-full h-96 object-cover rounded" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{selected.title}</h3>
                    <p className="text-sm text-gray-400">{selected.category} • ⭐ {selected.rating}</p>
                  </div>
                  <div className="text-2xl font-bold">{currency(selected.price)}</div>
                </div>

                <p className="mt-4 text-gray-300">{selected.description}</p>

                <div className="mt-6 flex items-center gap-3">
                  <button onClick={() => addToCart(selected, 1)} className="py-2 px-4 rounded-full bg-amber-400 text-black font-semibold">
                    Añadir al carrito
                  </button>
                  <button onClick={() => { addToCart(selected, 1); setShowCart(true); setSelected(null); }} className="py-2 px-4 rounded-full border border-slate-700">
                    Comprar ahora
                  </button>
                  <button onClick={() => setSelected(null)} className="ml-auto text-sm text-gray-400">Cerrar</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pago */}
      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutModal
            onClose={() => setCheckoutOpen(false)}
            onConfirm={handleCheckout}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
          />
        )}
      </AnimatePresence>

      <footer className="mt-20 py-8 text-center text-gray-500">
        © {new Date().getFullYear()} GymStore con Diseñado ❤️
      </footer>
    </div>
  );
}

// Componente
function CheckoutModal({ onClose, onConfirm, subtotal, shipping, total }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", postal: "", country: "Mexico" });

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    // Validación Básica
    if (!form.name || !form.address || !form.email) return alert("Completa los campos requeridos");
    onConfirm(form);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <motion.form
        onSubmit={submit}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="relative z-50 bg-slate-900 p-6 rounded-2xl w-full max-w-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Checkout</h3>
          <button onClick={onClose} type="button" className="p-2 rounded-full bg-slate-800">
            <X />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Nombre completo</label>
            <input required value={form.name} onChange={handle("name")} className="w-full p-2 rounded bg-slate-800 mt-1" />

            <label className="text-sm text-gray-400 mt-3">Email</label>
            <input required value={form.email} onChange={handle("email")} className="w-full p-2 rounded bg-slate-800 mt-1" />

            <label className="text-sm text-gray-400 mt-3">Dirección</label>
            <input required value={form.address} onChange={handle("address")} className="w-full p-2 rounded bg-slate-800 mt-1" />

            <div className="mt-3 flex gap-2">
              <div className="flex-1">
                <label className="text-sm text-gray-400">Ciudad</label>
                <input value={form.city} onChange={handle("city")} className="w-full p-2 rounded bg-slate-800 mt-1" />
              </div>
              <div className="w-32">
                <label className="text-sm text-gray-400">C.P.</label>
                <input value={form.postal} onChange={handle("postal")} className="w-full p-2 rounded bg-slate-800 mt-1" />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 text-sm text-gray-400">Resumen de pago</div>
            <div className="bg-slate-800 p-4 rounded space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>Subtotal</span>
                <span>{currency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>Envío</span>
                <span>{currency(shipping)}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span>{currency(total)}</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-400">Método de pago (simulado)</label>
              <select className="w-full p-2 rounded bg-slate-800 mt-1">
                <option>Tarjeta (simulado)</option>
                <option>Oxxo / Pago en efectivo (simulado)</option>
              </select>

              <p className="text-xs text-gray-500 mt-3">Para procesar pagos reales, integra Stripe o PayPal en el backend.</p>
            </div>

            <div className="mt-6 flex gap-2">
              <button type="submit" className="flex-1 py-2 rounded-full bg-amber-400 text-black font-semibold">Confirmar pedido</button>
              <button onClick={onClose} type="button" className="py-2 px-4 rounded-full border">Cancelar</button>
            </div>
          </div>
        </div>
      </motion.form>
    </div>
  );
}