SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS laboratorio;
CREATE DATABASE laboratorio 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_0900_ai_ci;

USE laboratorio;

-- ==============================
-- TABELAS SEM DEPENDÊNCIA
-- ==============================

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password TEXT NOT NULL,
  isAdmin VARCHAR(1) DEFAULT NULL,
  profileImage VARCHAR(250) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO users (id, name, email, password, isAdmin, profileImage)
VALUES
(14, 'admin', 'admin@admin.com', '$2b$10$iNIHL2Q9QDoX3UUF6KexYekts6HVod69Fo6vzclbhDK3jKb/M3FZy', 'S', NULL);

CREATE TABLE pacientes (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(50) NOT NULL,
  idade VARCHAR(10) NOT NULL,
  data TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE medicos (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(30) NOT NULL,
  crm VARCHAR(10) DEFAULT NULL,
  estado VARCHAR(2) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY unique_medico (nome, crm)
) ENGINE=InnoDB;

CREATE TABLE exames (
  id INT NOT NULL AUTO_INCREMENT,
  cod VARCHAR(5) NOT NULL,
  nome VARCHAR(30) NOT NULL,
  valor DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY cod (cod)
) ENGINE=InnoDB;

CREATE TABLE logexame (
  id_log INT NOT NULL AUTO_INCREMENT,
  id_exame INT NOT NULL,
  cod VARCHAR(5),
  exame VARCHAR(50),
  data_alteracao DATETIME DEFAULT CURRENT_TIMESTAMP,
  tipo_alteracao VARCHAR(20),
  valor DECIMAL(10,2),
  id_user INT NOT NULL,
  PRIMARY KEY (id_log),
  CONSTRAINT fk_logexame_user FOREIGN KEY (id_user) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE logpaciente (
  id_log INT NOT NULL AUTO_INCREMENT,
  id_paciente INT NOT NULL,
  idade VARCHAR(10),
  paciente VARCHAR(50),
  data_alteracao DATETIME DEFAULT CURRENT_TIMESTAMP,
  tipo_alteracao VARCHAR(20),
  id_user INT NOT NULL,
  PRIMARY KEY (id_log),
  CONSTRAINT fk_logpaciente_user FOREIGN KEY (id_user) REFERENCES users(id)
) ENGINE=InnoDB;

-- ==============================
-- TABELAS COM DEPENDÊNCIA
-- ==============================

CREATE TABLE atendimentos (
  id INT NOT NULL AUTO_INCREMENT,
  paciente_id INT NOT NULL,
  data_atendimento DATETIME DEFAULT CURRENT_TIMESTAMP,
  valor_total DECIMAL(10,2) DEFAULT NULL,
  medico_id INT DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_atendimento_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
  CONSTRAINT fk_medicoid FOREIGN KEY (medico_id) REFERENCES medicos(id)
) ENGINE=InnoDB;

CREATE TABLE exames_atendimento (
  id INT NOT NULL AUTO_INCREMENT,
  atendimento_id INT NOT NULL,
  exames_id INT NOT NULL,
  resultado TEXT,
  data_realizacao DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_exame_atendimento FOREIGN KEY (atendimento_id) REFERENCES atendimentos(id) ON DELETE RESTRICT,
  CONSTRAINT fk_exame FOREIGN KEY (exames_id) REFERENCES exames(id)
) ENGINE=InnoDB;

CREATE TABLE pagamentos (
  id INT NOT NULL AUTO_INCREMENT,
  atendimento_id INT NOT NULL,
  data_pagamento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valor_pago DECIMAL(10,2) NOT NULL,
  metodo_pagamento ENUM('Dinheiro','Cartao','Pix','Boleto') NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_pagamento_atendimento FOREIGN KEY (atendimento_id) REFERENCES atendimentos(id)
) ENGINE=InnoDB;

CREATE TABLE agendamento (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  sexo ENUM('Masculino','Feminino') NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  rg VARCHAR(15),
  nascimento DATE,
  telefone VARCHAR(20),
  email VARCHAR(100),
  rua VARCHAR(150),
  numero VARCHAR(10),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(30),
  cep VARCHAR(10),
  data_consulta DATE,
  horario TIME,
  tipo_consulta VARCHAR(50),
  retorno ENUM('S','N') DEFAULT 'N',
  observacao TEXT,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

COMMIT;
