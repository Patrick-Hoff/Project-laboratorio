-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 10-Jan-2026 às 15:19
-- Versão do servidor: 9.1.0
-- versão do PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `lab`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `agendamento`
--

DROP TABLE IF EXISTS `agendamento`;
CREATE TABLE IF NOT EXISTS `agendamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `sexo` enum('Masculino','Feminino') DEFAULT NULL,
  `cpf` char(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `rg` varchar(15) DEFAULT NULL,
  `nascimento` date NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `email` varchar(200) NOT NULL,
  `rua` varchar(100) DEFAULT NULL,
  `numero` int DEFAULT NULL,
  `bairro` varchar(50) DEFAULT NULL,
  `cidade` varchar(50) DEFAULT NULL,
  `estado` varchar(30) DEFAULT NULL,
  `cep` varchar(10) DEFAULT NULL,
  `data_consulta` date NOT NULL,
  `horario` time NOT NULL,
  `tipo_consulta` varchar(50) DEFAULT NULL,
  `retorno` enum('S','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `observacao` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `agendamento`
--

INSERT INTO `agendamento` (`id`, `nome`, `sexo`, `cpf`, `rg`, `nascimento`, `telefone`, `email`, `rua`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `data_consulta`, `horario`, `tipo_consulta`, `retorno`, `observacao`) VALUES
(60, 'Patrick', 'Masculino', '417.462.258-23', '50943195-1', '2005-12-09', '(11) 97985-9340', 'patrickhoffmanncampos@gmail.com', 'Rua Jesuíno Antônio', 775, 'Novo Osasco', 'Osasco', 'Sao Paulo', '06045-080', '2026-12-15', '16:00:00', 'esil', '', 'fasdfasdfasdf'),
(61, 'Patrick', 'Masculino', '417.462.258-22', '50943159-4', '2000-05-05', '(11) 97985-9340', 'patrickhoffmanncampos@gmail.com', 'Rua Jesuíno Antônio', 775, '', 'Osasco', 'Sao Paulo', '06045-080', '2025-12-18', '05:00:00', 'seila', 'S', 'teste di seila'),
(62, 'TESTE HORARIO', 'Masculino', '111.111.111-11', '11111111-1', '0000-00-00', '(11) 11111-1111', '', '111111111', 111111111, '11111111', '1111111111', '111111111', '11111-111', '2025-12-26', '16:00:00', 'SEILA', 'S', 'TESTE DE HORARIO');

-- --------------------------------------------------------

--
-- Estrutura da tabela `atendimentos`
--

DROP TABLE IF EXISTS `atendimentos`;
CREATE TABLE IF NOT EXISTS `atendimentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `data_atendimento` datetime DEFAULT CURRENT_TIMESTAMP,
  `valor_total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `atendimentos`
--

INSERT INTO `atendimentos` (`id`, `paciente_id`, `data_atendimento`, `valor_total`) VALUES
(54, 8, '2025-07-25 21:37:28', 0.00),
(56, 1, '2025-08-09 23:19:36', 0.00),
(58, 2, '2025-08-27 21:41:30', 760.50),
(59, 4, '2025-09-04 18:20:36', 0.00),
(60, 4, '2025-09-05 23:01:52', 240.00),
(61, 3, '2025-09-08 19:37:58', 1150.00),
(63, 3, '2025-09-14 14:22:41', 10.00),
(65, 10, '2025-11-22 12:45:40', 0.00),
(66, 6, '2025-11-23 08:18:56', 65.00),
(67, 11, '2025-11-26 19:33:19', 150.00),
(68, 13, '2025-12-01 22:53:40', 50.00);

-- --------------------------------------------------------

--
-- Estrutura da tabela `exames`
--

DROP TABLE IF EXISTS `exames`;
CREATE TABLE IF NOT EXISTS `exames` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cod` varchar(20) DEFAULT NULL,
  `nome` varchar(30) NOT NULL,
  `valor` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cod` (`cod`)
) ENGINE=MyISAM AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `exames`
--

INSERT INTO `exames` (`id`, `cod`, `nome`, `valor`) VALUES
(64, 'teste', 'teste', 0.00),
(65, 'hiv', 'hiv', 0.00),
(66, 'ttt', 'ttt', 0.00),
(67, 'eas', 'eas', 0.00),
(68, 'LOG', 'LOG', 0.00),
(69, 'ttttt', 'testando o valor no log', 10.00),
(70, 'exlog', 'exame log teste do valor', 10.00),
(72, 'pezin', 'teste do pezinho', 50.00);

-- --------------------------------------------------------

--
-- Estrutura da tabela `exames_atendimento`
--

DROP TABLE IF EXISTS `exames_atendimento`;
CREATE TABLE IF NOT EXISTS `exames_atendimento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `atendimento_id` int NOT NULL,
  `exames_id` int NOT NULL,
  `resultado` text,
  `data_realizacao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `exames_id` (`exames_id`),
  KEY `fk_atendimento` (`atendimento_id`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `exames_atendimento`
--

INSERT INTO `exames_atendimento` (`id`, `atendimento_id`, `exames_id`, `resultado`, `data_realizacao`) VALUES
(5, 58, 1, 'pendente', NULL),
(27, 58, 8, 'pendente', NULL),
(28, 58, 7, 'pendente', NULL),
(29, 58, 11, 'pendente', NULL),
(30, 58, 10, 'pendente', NULL),
(31, 58, 9, 'pendente', NULL),
(66, 60, 9, 'pendente', NULL),
(67, 60, 11, 'pendente', NULL),
(68, 60, 10, 'pendente', NULL),
(77, 61, 9, 'pendente', NULL),
(78, 61, 11, 'pendente', NULL),
(79, 61, 10, 'pendente', NULL),
(80, 61, 12, 'pendente', NULL),
(87, 63, 10, 'pendente', NULL),
(97, 66, 54, 'pendente', '2025-11-26 19:44:24'),
(98, 66, 57, 'pendente', '2025-11-26 19:44:58'),
(103, 67, 60, 'pendente', NULL),
(104, 67, 63, 'pendente', NULL),
(105, 67, 59, 'pendente', '2025-11-27 07:40:08'),
(106, 67, 65, 'pendente', '2025-11-27 07:50:40'),
(107, 67, 64, 'pendente', '2025-11-27 07:50:42'),
(108, 68, 72, 'pendente', '2025-12-01 22:53:43');

-- --------------------------------------------------------

--
-- Estrutura da tabela `logexame`
--

DROP TABLE IF EXISTS `logexame`;
CREATE TABLE IF NOT EXISTS `logexame` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `id_exame` int NOT NULL,
  `cod` varchar(5) DEFAULT NULL,
  `exame` varchar(50) DEFAULT NULL,
  `data_alteracao` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo_alteracao` varchar(20) DEFAULT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_log`)
) ENGINE=MyISAM AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `logexame`
--

INSERT INTO `logexame` (`id_log`, `id_exame`, `cod`, `exame`, `data_alteracao`, `tipo_alteracao`, `valor`) VALUES
(1, 1, 'teste', 'teste do seila', '2025-08-09 00:22:09', 'Insert', NULL),
(2, 2, 'ttst', 'exame teste', '2025-08-09 00:22:26', 'Insert', NULL),
(3, 2, 'ttst', 'exame teste', '2025-08-29 20:40:23', 'Update - Antes', NULL),
(4, 2, 'ttst', 'exame teste', '2025-08-29 20:40:23', 'Update - Depois', NULL),
(5, 4, '11111', '1111111111111111', '2025-08-29 20:52:57', 'Delete', NULL),
(6, 3, 'jfaks', 'fklsdjklfjasdkljfk', '2025-08-29 20:52:57', 'Delete', NULL),
(7, 1, 'teste', 'teste do seila', '2025-08-29 20:52:59', 'Delete', NULL),
(8, 2, 'ttst', 'exame teste', '2025-08-29 20:52:59', 'Delete', NULL),
(9, 7, 'seila', 'teste', '2025-08-29 20:55:56', 'Update - Antes', NULL),
(10, 7, 'seila', 'teste', '2025-08-29 20:55:56', 'Update - Depois', NULL),
(11, 7, 'seila', 'teste', '2025-08-29 20:56:13', 'Update - Antes', NULL),
(12, 7, 'seila', 'teste', '2025-08-29 20:56:13', 'Update - Depois', NULL),
(13, 7, 'seila', 'teste', '2025-08-29 20:56:30', 'Update - Antes', NULL),
(14, 7, 'seila', 'teste', '2025-08-29 20:56:30', 'Update - Depois', NULL),
(15, 7, 'seila', 'teste', '2025-08-30 07:41:31', 'Update - Antes', NULL),
(16, 7, 'seila', 'teste', '2025-08-30 07:41:31', 'Update - Depois', NULL),
(17, 7, 'seila', 'teste', '2025-08-30 07:41:57', 'Update - Antes', NULL),
(18, 7, 'seila', 'teste', '2025-08-30 07:41:57', 'Update - Depois', NULL),
(19, 7, 'seila', 'teste', '2025-08-30 07:42:05', 'Update - Antes', NULL),
(20, 7, 'seila', 'teste', '2025-08-30 07:42:05', 'Update - Depois', NULL),
(21, 7, 'seila', 'teste', '2025-08-30 07:43:38', 'Update - Antes', NULL),
(22, 7, 'seila', 'teste', '2025-08-30 07:43:38', 'Update - Depois', NULL),
(23, 8, 'valor', 'testando valor', '2025-08-30 07:49:03', 'Update - Antes', NULL),
(24, 8, 'valor', 'testando valor', '2025-08-30 07:49:03', 'Update - Depois', NULL),
(25, 8, 'valor', 'testando valor', '2025-08-31 17:40:21', 'Update - Antes', NULL),
(26, 8, 'valor', 'testando valor', '2025-08-31 17:40:21', 'Update - Depois', NULL),
(27, 7, 'seila', 'teste', '2025-09-04 17:55:34', 'Delete', NULL),
(28, 5, 'teste', 'teste', '2025-09-04 17:55:34', 'Delete', NULL),
(29, 6, 'novo', 'novo teste', '2025-09-04 17:55:34', 'Delete', NULL),
(30, 8, 'valor', 'testando valor', '2025-09-04 17:55:34', 'Delete', NULL),
(31, 11, 'hemo', 'hemograma ', '2025-09-04 20:46:21', 'Update - Antes', NULL),
(32, 11, 'hemo', 'hemograma completo', '2025-09-04 20:46:21', 'Update - Depois', NULL),
(33, 10, 'hiv', 'hiv', '2025-09-08 18:37:59', 'Update - Antes', NULL),
(34, 10, 'hiv', 'hiv', '2025-09-08 18:37:59', 'Update - Depois', NULL),
(35, 11, 'hemo', 'hemograma completo', '2025-09-08 18:38:05', 'Update - Antes', NULL),
(36, 11, 'hemo', 'hemograma completo', '2025-09-08 18:38:05', 'Update - Depois', NULL),
(37, 10, 'hiv', 'hiv', '2025-09-08 18:43:19', 'Update - Antes', NULL),
(38, 10, 'hiv', 'hiv', '2025-09-08 18:43:19', 'Update - Depois', NULL),
(39, 11, 'hemo', 'hemograma completo', '2025-09-08 19:00:21', 'Update - Antes', NULL),
(40, 11, 'hemo', 'hemograma completo', '2025-09-08 19:00:21', 'Update - Depois', NULL),
(41, 11, 'hemo', 'hemograma completo', '2025-09-08 19:04:06', 'Update - Antes', NULL),
(42, 11, 'hemo', 'hemograma completo', '2025-09-08 19:04:06', 'Update - Depois', NULL),
(43, 13, 'mamam', 'mamamamammaa', '2025-09-08 19:15:44', 'Delete', NULL),
(44, 10, 'hiv', 'hiv', '2025-09-08 19:15:55', 'Update - Antes', NULL),
(45, 10, 'hiv', 'hiv', '2025-09-08 19:15:55', 'Update - Depois', NULL),
(46, 10, 'hiv', 'hiv', '2025-09-08 23:03:07', 'Update - Antes', NULL),
(47, 10, 'hiv', 'hiv', '2025-09-08 23:03:07', 'Update - Depois', NULL),
(48, 58, 'T', 'TESTE DE CADASTRO COM DATA', '2025-11-26 19:44:41', 'Delete', NULL),
(49, 63, 'melou', 'mal', '2025-11-26 21:08:34', 'Update - Antes', NULL),
(50, 63, 'melou', 'mal', '2025-11-26 21:08:34', 'Update - Depois', NULL),
(51, 63, 'melou', 'mal', '2025-11-27 07:40:35', 'Delete', NULL),
(52, 62, 'c', 'c', '2025-11-27 07:40:35', 'Delete', NULL),
(53, 61, 'ccccc', 'ccccccccccc', '2025-11-27 07:40:35', 'Delete', NULL),
(54, 60, 'melo', 'fadsfasdf', '2025-11-27 07:40:36', 'Delete', NULL),
(55, 59, 'tes', 'tes', '2025-11-27 07:40:36', 'Delete', NULL),
(56, 57, 'ex1', 'exame1', '2025-11-27 07:40:36', 'Delete', NULL),
(57, 56, 'ex', 'exame', '2025-11-27 07:40:36', 'Delete', NULL),
(58, 55, 'teste', 'hiv', '2025-11-27 07:40:37', 'Delete', NULL),
(59, 54, 'teste', 'teste do pezinho', '2025-11-27 07:40:37', 'Delete', NULL),
(60, 53, 'teste', 'hiv', '2025-11-27 07:40:37', 'Delete', NULL),
(61, 52, 'teste', 'teste do pezinho', '2025-11-27 07:40:37', 'Delete', NULL),
(62, 51, 'teste', 'hiv', '2025-11-27 07:40:37', 'Delete', NULL),
(63, 50, 'teste', 'hemograma completo', '2025-11-27 07:40:38', 'Delete', NULL),
(64, 49, 'teste', 'exame de sangue', '2025-11-27 07:40:38', 'Delete', NULL),
(65, 48, 'teste', 'teste do pezinho', '2025-11-27 07:40:38', 'Delete', NULL),
(66, 47, 'teste', 'hiv', '2025-11-27 07:40:38', 'Delete', NULL),
(67, 46, 'teste', 'hemograma completo', '2025-11-27 07:40:38', 'Delete', NULL),
(68, 45, 'teste', 'exame de sangue', '2025-11-27 07:40:38', 'Delete', NULL),
(69, 44, 'teste', 'teste do pezinho', '2025-11-27 07:40:39', 'Delete', NULL),
(70, 43, 'teste', 'hiv', '2025-11-27 07:40:39', 'Delete', NULL),
(71, 42, 'teste', 'teste do pezinho', '2025-11-27 07:40:39', 'Delete', NULL),
(72, 41, 'teste', 'hiv', '2025-11-27 07:40:39', 'Delete', NULL),
(73, 40, 'teste', 'teste do pezinho', '2025-11-27 07:40:39', 'Delete', NULL),
(74, 39, 'teste', 'hiv', '2025-11-27 07:40:39', 'Delete', NULL),
(75, 38, 'teste', 'hemograma completo', '2025-11-27 07:40:40', 'Delete', NULL),
(76, 37, 'teste', 'exame de sangue', '2025-11-27 07:40:40', 'Delete', NULL),
(77, 36, 'teste', 'teste do pezinho', '2025-11-27 07:40:40', 'Delete', NULL),
(78, 35, 'teste', 'hiv', '2025-11-27 07:40:40', 'Delete', NULL),
(79, 34, 'teste', 'hemograma completo', '2025-11-27 07:40:40', 'Delete', NULL),
(80, 33, 'teste', 'exame de sangue', '2025-11-27 07:40:41', 'Delete', NULL),
(81, 32, 'dup_h', 'hiv', '2025-11-27 07:40:41', 'Delete', NULL),
(82, 31, 'dup_p', 'teste do pezinho', '2025-11-27 07:40:41', 'Delete', NULL),
(83, 30, 'dup_h', 'hiv', '2025-11-27 07:40:41', 'Delete', NULL),
(84, 29, 'dup_p', 'teste do pezinho', '2025-11-27 07:40:41', 'Delete', NULL),
(85, 28, 'dup_h', 'hiv', '2025-11-27 07:40:42', 'Delete', NULL),
(86, 27, 'dup_h', 'hemograma completo', '2025-11-27 07:40:42', 'Delete', NULL),
(87, 26, 'dup_s', 'exame de sangue', '2025-11-27 07:40:42', 'Delete', NULL),
(88, 25, 'dup_p', 'teste do pezinho', '2025-11-27 07:40:42', 'Delete', NULL),
(89, 24, 'dup_h', 'hiv', '2025-11-27 07:40:42', 'Delete', NULL),
(90, 23, 'dup_h', 'hemograma completo', '2025-11-27 07:40:42', 'Delete', NULL),
(91, 22, 'dup_s', 'exame de sangue', '2025-11-27 07:40:43', 'Delete', NULL),
(92, 21, 'pezin', 'teste do pezinho', '2025-11-27 07:40:43', 'Delete', NULL),
(93, 20, 'hivT_', 'hiv', '2025-11-27 07:40:43', 'Delete', NULL),
(94, 19, 'pezin', 'teste do pezinho', '2025-11-27 07:40:43', 'Delete', NULL),
(95, 18, 'hiv_D', 'hiv', '2025-11-27 07:40:43', 'Delete', NULL),
(96, 17, 'pezin', 'teste do pezinho', '2025-11-27 07:40:44', 'Delete', NULL),
(97, 16, 'hivT', 'hiv', '2025-11-27 07:40:44', 'Delete', NULL),
(98, 15, 'hemoT', 'hemograma completo', '2025-11-27 07:40:44', 'Delete', NULL),
(99, 14, 'sangu', 'exame de sangue', '2025-11-27 07:40:44', 'Delete', NULL),
(100, 12, 'sangu', 'exame de sangue', '2025-11-27 07:40:44', 'Delete', NULL),
(101, 11, 'hemo', 'hemograma completo', '2025-11-27 07:40:45', 'Delete', NULL),
(102, 10, 'hiv', 'hiv', '2025-11-27 07:40:45', 'Delete', NULL),
(103, 9, 'pezin', 'teste do pezinho', '2025-11-27 07:40:45', 'Delete', NULL),
(104, 68, 'LOG', 'LOG', '2025-11-27 07:48:49', 'Insert', 0.00),
(105, 71, 'value', 'valor teste do log exam', '2025-11-30 11:58:32', 'Insert', 10000.00),
(106, 71, 'value', 'testando log com o valor ', '2025-11-30 12:09:25', 'Update - Antes', 100.00),
(107, 71, 'value', 'testando log com o valor numero 100 do valor', '2025-11-30 12:09:25', 'Update - Depois', 100.00),
(108, 71, 'value', 'testando log com o valor numer', '2025-11-30 12:11:08', 'Update - Antes', 100.00),
(109, 71, 'value', 'testando log com o valor numer', '2025-11-30 12:11:08', 'Update - Depois', 99999999.99),
(110, 71, 'value', 'testando log com o valor numer', '2025-11-30 12:19:58', 'Delete', 99999999.99),
(111, 72, 'pezin', 'teste do pezinho', '2025-12-01 22:52:46', 'Insert', 50.00);

-- --------------------------------------------------------

--
-- Estrutura da tabela `logpaciente`
--

DROP TABLE IF EXISTS `logpaciente`;
CREATE TABLE IF NOT EXISTS `logpaciente` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `idade` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `paciente` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `data_alteracao` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo_alteracao` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_log`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `logpaciente`
--

INSERT INTO `logpaciente` (`id_log`, `id_paciente`, `idade`, `paciente`, `data_alteracao`, `tipo_alteracao`) VALUES
(1, 1, '2005-12-09', 'patrick', '2025-08-09 00:21:52', 'Insert'),
(2, 1, 'patrick', '2005-12-09', '2025-08-11 18:27:24', 'Delete'),
(3, 2, '1990-12-05', 'create teste', '2025-08-12 18:19:50', 'Insert'),
(4, 2, 'create tes', '1990-12-05', '2025-09-04 18:11:00', 'Delete'),
(5, 3, '2005-12-09', 'patrick', '2025-09-04 18:20:23', 'Insert'),
(6, 4, '2020-05-01', 'teste', '2025-09-04 20:46:53', 'Insert'),
(7, 11, '2000-12-09', 'teste paciente dia', '2025-11-26 19:32:46', 'Insert'),
(8, 12, '2000-02-09', 'teste', '2025-11-27 07:50:32', 'Insert'),
(9, 13, '2000-01-01', 'nome do pacientes de teste', '2025-12-01 22:53:23', 'Insert');

-- --------------------------------------------------------

--
-- Estrutura da tabela `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
CREATE TABLE IF NOT EXISTS `pacientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `idade` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `data` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `pacientes`
--

INSERT INTO `pacientes` (`id`, `nome`, `idade`, `data`) VALUES
(3, 'patrick', '2005-12-09', '2025-11-23 12:41:10'),
(4, 'teste', '2020-05-01', '2025-11-23 12:41:10'),
(5, 'patrick', '2005-12-09', '2025-11-23 12:41:10'),
(6, 'teste', '2020-05-01', '2025-11-23 12:41:10'),
(7, 'DUP_patrick', '2005-12-09', '2025-11-23 12:41:10'),
(8, 'DUP_teste', '2020-05-01', '2025-11-23 12:41:10'),
(9, 'DUP_patrick', '2005-12-09', '2025-11-23 12:41:10'),
(10, 'DUP_teste', '2020-05-01', '2025-11-23 12:41:10'),
(11, 'teste paciente dia', '2000-12-09', '2025-11-26 22:32:46'),
(12, 'teste', '2000-02-09', '2025-11-27 10:50:32'),
(13, 'nome do pacientes de teste', '2000-01-01', '2025-12-02 01:53:23');

-- --------------------------------------------------------

--
-- Estrutura da tabela `pagamentos`
--

DROP TABLE IF EXISTS `pagamentos`;
CREATE TABLE IF NOT EXISTS `pagamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `atendimento_id` int NOT NULL,
  `data_pagamento` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `valor_pago` decimal(10,2) NOT NULL,
  `metodo_pagamento` enum('Dinheiro','Cartao','Pix','Boleto') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pagamento_atendimento` (`atendimento_id`)
) ENGINE=MyISAM AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `pagamentos`
--

INSERT INTO `pagamentos` (`id`, `atendimento_id`, `data_pagamento`, `valor_pago`, `metodo_pagamento`) VALUES
(113, 67, '2025-11-26 21:09:15', 10.00, 'Cartao'),
(112, 66, '2025-11-23 08:20:29', 80.00, 'Dinheiro'),
(111, 64, '2025-10-07 18:18:30', 100.00, 'Dinheiro'),
(110, 61, '2025-09-08 23:04:58', 1000.00, 'Dinheiro'),
(109, 61, '2025-09-08 19:49:24', 10.00, 'Dinheiro'),
(108, 59, '2025-09-08 19:17:03', 1.00, 'Pix');

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `isAdmin` varchar(1) DEFAULT NULL,
  `profileImage` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `isAdmin`, `profileImage`) VALUES
(9, 'teste', 'teste@teste.com', '123', 'S', NULL),
(10, '', '', '$2b$10$UB85ee1e1es0lHfO.fuAD.Cgh7zeUSjzVG1aBqAj2FsKAC7xCXSdK', NULL, NULL),
(11, 'Patrick hoffmann campos', 'patrick@gmail.com', '$2b$10$OMC7TBd0Ih069WJuEgNy..p/kv64/XjDl8EgBg9di1xwxUukwbvEe', 'S', '1756166374444.jpg'),
(12, 'maria', 'maria@gmail.com', '$2b$10$fqyncUQfGKtJd0oBzzt17epgQyQsAutNT//bBhIYTTX7taQ8iId5O', 'S', '1756166476401.jpg'),
(13, '', '', '$2b$10$Tst4ssb89CMXKAbHc1CHf.X4t84Tb8.qVbD/z4JN1GsYlp6IouEfi', NULL, NULL),
(14, 'admin', 'admin@admin.com', '$2b$10$r/B8k/hjIIW3sBRYH8WY0e1S2yrpKCN71qHHvUa.nmr3RutPoKQKu', 'S', '1759872093021.jpg');

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `exames_atendimento`
--
ALTER TABLE `exames_atendimento`
  ADD CONSTRAINT `fk_atendimento` FOREIGN KEY (`atendimento_id`) REFERENCES `atendimentos` (`id`) ON DELETE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
