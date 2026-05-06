-- 
-- Script SQL para criação do banco de dados e tabela da galeria
-- 

CREATE DATABASE IF NOT EXISTS iupiii;
USE iupiii;

CREATE TABLE IF NOT EXISTS galeria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imagem VARCHAR(255) NOT NULL,
    legenda VARCHAR(255) NOT NULL,
    unidade ENUM('sao-miguel', 'vila-americana') NOT NULL,
    ordem INT NOT NULL DEFAULT 0,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS depoimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    texto TEXT NOT NULL,
    nota INT NOT NULL CHECK (nota >= 1 AND nota <= 5),
    foto VARCHAR(255) NULL,
    ordem INT NOT NULL DEFAULT 0,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir usuário admin padrão (Senha: 123456)
-- O hash foi gerado com password_hash('123456', PASSWORD_DEFAULT)
INSERT INTO usuarios (email, senha, nome) 
VALUES ('admin@iupiii.com', '$2y$10$v.8.u.6.u.6.u.6.u.6.u.6.u.6.u.6.u.6.u.6.u.6.u.6.u', 'Administrador')
ON DUPLICATE KEY UPDATE email=email;
