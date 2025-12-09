-- Script de Criação do Banco de Dados - Sistema de Gestão

-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS sistema_gestao;
USE sistema_gestao;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- Recomendado: Armazenar hash da senha
    tipo VARCHAR(50) NOT NULL DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Contratos
CREATE TABLE IF NOT EXISTS contracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_contrato VARCHAR(50) NOT NULL,
    empresa VARCHAR(255) NOT NULL,
    data_inicio DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    status ENUM('Ativo', 'Suspenso', 'Vencido', 'Cancelado') NOT NULL DEFAULT 'Ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Notas Fiscais
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_nota VARCHAR(50) NOT NULL,
    empenho VARCHAR(50) NOT NULL,
    empresa VARCHAR(255) NOT NULL,
    setor VARCHAR(100) NOT NULL,
    data_nota DATE NOT NULL,
    data_entrada DATE NOT NULL,
    data_saida DATE,
    valor DECIMAL(15, 2) NOT NULL,
    observacao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserção de Dados Iniciais (Usuário Admin Padrão)
-- Senha 'admin123' deve ser hashada em produção
INSERT INTO users (nome, email, usuario, senha, tipo) VALUES 
('Administrador', 'admin@sistema.com', 'admin', 'admin123', 'Administrador');

-- Exemplo de Inserção de Contrato
-- INSERT INTO contracts (numero_contrato, empresa, data_inicio, data_vencimento, status) VALUES 
-- ('001/2025', 'Empresa Exemplo LTDA', '2025-01-01', '2025-12-31', 'Ativo');

-- Exemplo de Inserção de Nota Fiscal
-- INSERT INTO notes (numero_nota, empenho, empresa, setor, data_nota, data_entrada, valor, observacao) VALUES 
-- ('12345', 'EMP001', 'Fornecedor A', 'Secretaria de Saúde', '2025-02-15', '2025-02-16', 1500.00, 'Material de escritório');
