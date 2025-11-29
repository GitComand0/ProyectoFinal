-- init.sql : crea tablas y seed básico

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category TEXT,
  rating NUMERIC(3,2),
  img TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  address TEXT,
  city TEXT,
  postal TEXT,
  country TEXT,
  subtotal NUMERIC(10,2),
  shipping NUMERIC(10,2),
  total NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_title TEXT,
  unit_price NUMERIC(10,2),
  qty INTEGER
);





-- Seed: productos sample (usa tus imágenes o URLs)
INSERT INTO products (title, price, category, rating, img, description)
VALUES
('Pre-Workout Blast', 29.99, 'Suplementos', 4.6,
 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b4f5f5d17f0b6b4d6a1b5b6d6c8c9e6',
 'Pre-workout energizante con cafeína natural, beta-alanina y aminoácidos para explosión de energía y enfoque.'),
('Protein Pro 2kg', 54.99, 'Suplementos', 4.8,
 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=aa2f0df6b9d6f0e5a4c3e3d7a9e9b8c1',
 'Proteína aislada de suero, 25g por porción, sabor neutro y chocolate. Ideal para recuperación muscular.'),
('Athletic Tee - Black', 24.99, 'Ropa', 4.4,
 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=8b7f9b6c6f9c1234d7e6f8a1b2c3d4e5',
 'Camiseta deportiva transpirable, corte atlético. Te mantiene fresco durante entrenamientos intensos.'),
('Training Shorts - Grey', 27.50, 'Ropa', 4.2,
 'https://images.unsplash.com/photo-1520975918854-8f5f79b0d0de?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3cd6d7efb7a7c6e8b9f6a1e0d2c3b4a5',
 'Shorts ligeros con forro interno, bolsillo con cremallera y cintura elástica.'),
('BCAA Recovery', 19.99, 'Suplementos', 4.1,
 'https://images.unsplash.com/photo-1600180758890-8b5f1a8b7c2d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1f2e3d4c5b6a7d8e9f0a1b2c3d4e5f6a',
 'Aminoácidos esenciales para recuperación. Mezcla en agua post-entreno.');




