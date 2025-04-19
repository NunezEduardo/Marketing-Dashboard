-- Creación de la base de datos para el sistema de predicción de productos
CREATE DATABASE IF NOT EXISTS marketing_prediction;
USE marketing_prediction;

-- Tabla de categorías de productos
CREATE TABLE IF NOT EXISTS product_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT,
    price DECIMAL(10, 2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(category_id)
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    birth_year INT,
    education VARCHAR(50),
    marital_status VARCHAR(50),
    income DECIMAL(12, 2),
    kidhome INT,
    teenhome INT,
    dt_customer DATE,
    recency INT,
    complain BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de compras
CREATE TABLE IF NOT EXISTS purchases (
    purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    purchase_date DATE,
    total_amount DECIMAL(10, 2),
    web_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Tabla de detalles de compra
CREATE TABLE IF NOT EXISTS purchase_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT,
    product_id INT,
    quantity INT,
    price_per_unit DECIMAL(10, 2),
    discount DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (purchase_id) REFERENCES purchases(purchase_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Tabla de predicciones
CREATE TABLE IF NOT EXISTS predictions (
    prediction_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    segment_name VARCHAR(100),
    probability DECIMAL(5, 2),
    expected_responders INT,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Tabla de segmentos de clientes
CREATE TABLE IF NOT EXISTS customer_segments (
    segment_id INT AUTO_INCREMENT PRIMARY KEY,
    segment_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de asignación de clientes a segmentos
CREATE TABLE IF NOT EXISTS customer_segment_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    segment_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (segment_id) REFERENCES customer_segments(segment_id)
);

-- Insertar categorías de productos
INSERT INTO product_categories (category_name, description) VALUES
('Vinos', 'Vinos de diferentes variedades y orígenes'),
('Frutas', 'Frutas frescas y productos derivados'),
('Carne', 'Carnes frescas y productos cárnicos'),
('Pescado', 'Pescados, mariscos y productos del mar'),
('Dulces', 'Productos dulces y postres'),
('Oro', 'Joyería y accesorios de oro'),
('Gourmet', 'Productos gourmet y delicatessen'),
('Electrónica', 'Dispositivos y accesorios electrónicos'),
('Belleza', 'Productos de belleza y cuidado personal'),
('Moda', 'Ropa, calzado y accesorios de moda'),
('Hogar', 'Productos para el hogar y decoración'),
('Experiencias', 'Experiencias y actividades'),
('Cultura', 'Productos culturales y entretenimiento'),
('Deportes', 'Equipamiento y accesorios deportivos');

-- Consulta para obtener productos con mayor probabilidad de respuesta
SELECT 
    p.name AS producto,
    pc.category_name AS categoria,
    p.price AS precio,
    AVG(pr.probability) AS probabilidad_promedio,
    SUM(pr.expected_responders) AS respuestas_esperadas_total
FROM 
    products p
JOIN 
    product_categories pc ON p.category_id = pc.category_id
JOIN 
    predictions pr ON p.product_id = pr.product_id
GROUP BY 
    p.product_id
ORDER BY 
    probabilidad_promedio DESC
LIMIT 10;

-- Consulta para obtener segmentos de clientes más receptivos
SELECT 
    cs.segment_name AS segmento,
    COUNT(DISTINCT c.customer_id) AS total_clientes,
    AVG(pr.probability) AS probabilidad_promedio
FROM 
    customer_segments cs
JOIN 
    customer_segment_assignments csa ON cs.segment_id = csa.segment_id
JOIN 
    customers c ON csa.customer_id = c.customer_id
JOIN 
    predictions pr ON pr.segment_name = cs.segment_name
GROUP BY 
    cs.segment_id
ORDER BY 
    probabilidad_promedio DESC;

-- Consulta para análisis de tendencias por categoría
SELECT 
    pc.category_name AS categoria,
    COUNT(DISTINCT p.product_id) AS total_productos,
    AVG(p.price) AS precio_promedio,
    AVG(pr.probability) AS probabilidad_promedio,
    SUM(pr.expected_responders) AS respuestas_esperadas_total
FROM 
    product_categories pc
JOIN 
    products p ON pc.category_id = p.category_id
LEFT JOIN 
    predictions pr ON p.product_id = pr.product_id
GROUP BY 
    pc.category_id
ORDER BY 
    probabilidad_promedio DESC;

-- Procedimiento almacenado para actualizar predicciones
DELIMITER //
CREATE PROCEDURE update_product_predictions(
    IN p_product_id INT,
    IN p_segment_name VARCHAR(100),
    IN p_probability DECIMAL(5, 2),
    IN p_expected_responders INT
)
BEGIN
    -- Verificar si ya existe una predicción para este producto y segmento
    DECLARE existing_id INT;
    
    SELECT prediction_id INTO existing_id
    FROM predictions
    WHERE product_id = p_product_id AND segment_name = p_segment_name
    LIMIT 1;
    
    -- Actualizar o insertar según corresponda
    IF existing_id IS NOT NULL THEN
        UPDATE predictions
        SET probability = p_probability,
            expected_responders = p_expected_responders,
            prediction_date = CURRENT_TIMESTAMP
        WHERE prediction_id = existing_id;
    ELSE
        INSERT INTO predictions (product_id, segment_name, probability, expected_responders)
        VALUES (p_product_id, p_segment_name, p_probability, p_expected_responders);
    END IF;
END //
DELIMITER ;

-- Trigger para actualizar estadísticas cuando se añade una nueva predicción
DELIMITER //
CREATE TRIGGER after_prediction_insert
AFTER INSERT ON predictions
FOR EACH ROW
BEGIN
    -- Aquí se podrían actualizar tablas de estadísticas o resúmenes
    -- Este es un ejemplo simplificado
    UPDATE products
    SET last_prediction_date = NEW.prediction_date
    WHERE product_id = NEW.product_id;
END //
DELIMITER ;