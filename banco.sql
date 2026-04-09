-- =============================================
-- Clínica Veterinária - Banco de Dados
-- Aluno: Gustavo Berg Ribeiro
-- =============================================

CREATE DATABASE IF NOT EXISTS clinica_vet
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE clinica_vet;

-- Tabela de Tutores
CREATE TABLE IF NOT EXISTS tutores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL,
  endereco VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Animais
CREATE TABLE IF NOT EXISTS animais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  especie VARCHAR(50) NOT NULL,
  raca VARCHAR(100) NOT NULL,
  data_nascimento DATE NOT NULL,
  peso DECIMAL(5,2) NOT NULL,
  tutor_id INT NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE CASCADE
);

-- Tabela de Consultas
CREATE TABLE IF NOT EXISTS consultas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT NOT NULL,
  data_consulta DATE NOT NULL,
  hora_consulta TIME NOT NULL,
  motivo VARCHAR(255) NOT NULL,
  diagnostico TEXT,
  tratamento TEXT,
  valor DECIMAL(10,2) NOT NULL,
  status ENUM('agendada','realizada','cancelada') NOT NULL DEFAULT 'agendada',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animais(id) ON DELETE CASCADE
);

-- =============================================
-- Dados de Exemplo
-- =============================================

INSERT INTO tutores (nome, cpf, telefone, email, endereco) VALUES
('Carlos Eduardo Mendes', '123.456.789-00', '(11) 98765-4321', 'carlos.mendes@email.com', 'Rua das Flores, 123 - São Paulo/SP'),
('Ana Paula Ferreira', '987.654.321-00', '(11) 91234-5678', 'ana.ferreira@email.com', 'Av. Paulista, 456 - São Paulo/SP'),
('Roberto Lima Santos', '456.789.123-00', '(19) 99876-5432', 'roberto.santos@email.com', 'Rua XV de Novembro, 789 - Campinas/SP'),
('Fernanda Costa Alves', '321.654.987-00', '(19) 98765-1234', 'fernanda.alves@email.com', 'Av. Brasil, 321 - Campinas/SP'),
('Lucas Oliveira Rocha', '654.321.098-00', '(11) 97654-3210', 'lucas.rocha@email.com', 'Rua Augusta, 654 - São Paulo/SP');

INSERT INTO animais (nome, especie, raca, data_nascimento, peso, tutor_id, observacoes) VALUES
('Rex', 'Cachorro', 'Golden Retriever', '2019-03-15', 28.50, 1, 'Alérgico a frango'),
('Mimi', 'Gato', 'Persa', '2020-07-22', 4.20, 2, 'Castrada, vacinada em dia'),
('Bolt', 'Cachorro', 'Border Collie', '2018-11-10', 18.00, 3, 'Muito ativo, precisa de exercício diário'),
('Luna', 'Gato', 'Siamês', '2021-01-05', 3.80, 4, 'Tímida, prefere ambientes calmos'),
('Thor', 'Cachorro', 'Labrador', '2017-06-30', 32.00, 5, 'Histórico de displasia no quadril'),
('Mel', 'Cachorro', 'Shih Tzu', '2022-04-18', 5.50, 1, 'Primeira consulta de rotina');

INSERT INTO consultas (animal_id, data_consulta, hora_consulta, motivo, diagnostico, tratamento, valor, status) VALUES
(1, '2025-01-10', '09:00:00', 'Consulta de rotina', 'Animal saudável', 'Vacinação anual e vermifugação', 150.00, 'realizada'),
(1, '2025-03-20', '14:30:00', 'Coceira excessiva', 'Dermatite alérgica', 'Anti-histamínico e banho medicamentoso', 220.00, 'realizada'),
(2, '2025-02-05', '10:00:00', 'Vômitos frequentes', 'Gastrite', 'Dieta especial e medicação gástrica', 180.00, 'realizada'),
(3, '2025-04-01', '08:30:00', 'Check-up anual', 'Animal saudável', 'Vacinação V10 e antiparasitário', 160.00, 'realizada'),
(4, '2025-04-10', '15:00:00', 'Consulta de rotina', NULL, NULL, 140.00, 'agendada'),
(5, '2025-01-25', '11:00:00', 'Dificuldade para andar', 'Piora da displasia coxofemoral', 'Anti-inflamatório e fisioterapia', 350.00, 'realizada'),
(6, '2025-04-15', '09:30:00', 'Primeira consulta', NULL, NULL, 120.00, 'agendada');
