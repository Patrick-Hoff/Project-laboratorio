
--
-- Estrutura da tabela `atendimentos`
--

DROP TABLE IF EXISTS `atendimentos`;
CREATE TABLE IF NOT EXISTS `atendimentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `data_atendimento` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Estrutura da tabela `exames`
--

DROP TABLE IF EXISTS `exames`;
CREATE TABLE IF NOT EXISTS `exames` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cod` varchar(5) NOT NULL,
  `nome` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cod` (`cod`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--- --------------------------------------------------------

--
-- Estrutura da tabela `exames_atendimento`
--

DROP TABLE IF EXISTS `exames_atendimento`;
CREATE TABLE IF NOT EXISTS `exames_atendimento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `atendimento_id` int NOT NULL,
  `exames_id` int NOT NULL,
  `resultado` text,
  `data_realizacao` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exames_id` (`exames_id`),
  KEY `fk_atendimento` (`atendimento_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
CREATE TABLE IF NOT EXISTS `pacientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `idade` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Estrutura da tabela `logexame`
--

CREATE TABLE IF NOT EXISTS `logexame` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `id_exame` int NOT NULL,
  `cod` varchar(5) DEFAULT NULL,
  `exame` varchar(50) DEFAULT NULL,
  `data_alteracao` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo_alteracao` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_log`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `logpaciente`
--

CREATE TABLE IF NOT EXISTS `logpaciente` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `idade` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `paciente` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `data_alteracao` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo_alteracao` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_log`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `exames_atendimento`
--
ALTER TABLE `exames_atendimento`
  ADD CONSTRAINT `fk_atendimento` FOREIGN KEY (`atendimento_id`) REFERENCES `atendimentos` (`id`) ON DELETE RESTRICT;
COMMIT;
