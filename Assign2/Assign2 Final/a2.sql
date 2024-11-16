
-- Tạo bảng users (người dùng)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 100.00  -- Số dư mặc định khi đăng ký
);

-- Tạo bảng items (các item có sẵn để mua)
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Tạo bảng purchases (giao dịch mua item của người dùng)
CREATE TABLE purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Thêm một số item mẫu vào bảng items
INSERT INTO items (name, type, price) VALUES
    ('Sword of Destiny', 'Weapon', 50.00),
    ('Shield of Valor', 'Armor', 30.00),
    ('Health Potion', 'Consumable', 10.00),
    ('Magic Ring', 'Accessory', 100.00);
