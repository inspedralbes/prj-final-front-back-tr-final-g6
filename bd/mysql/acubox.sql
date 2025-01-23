-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Temps de generació: 23-01-2025 a les 08:28:04
-- Versió del servidor: 10.4.32-MariaDB
-- Versió de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de dades: `acubox`
--

-- --------------------------------------------------------

--
-- Estructura de la taula `aula`
--

CREATE TABLE `aula` (
  `id` int(10) NOT NULL,
  `Curs` varchar(10) NOT NULL,
  `Classe` varchar(50) NOT NULL,
  `Etapa` enum('ESO','BATX','CFGM','CFGS') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `aula`
--

INSERT INTO `aula` (`id`, `Curs`, `Classe`, `Etapa`) VALUES
(1, '1r', 'DAM', 'CFGS'),
(2, '1r', 'A', 'ESO'),
(3, '2n', 'C', 'ESO'),
(4, '2n', 'B', 'BATX');

-- --------------------------------------------------------

--
-- Estructura de la taula `usuari`
--

CREATE TABLE `usuari` (
  `id` int(10) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `correu` varchar(50) NOT NULL,
  `contrasenya` varchar(100) NOT NULL,
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `usuari`
--

INSERT INTO `usuari` (`id`, `nom`, `correu`, `contrasenya`, `admin`) VALUES
(1, 'admin', 'admin@admin.com', 'admin', 1),
(2, 'professor', 'prof@prof.com', 'prof', 0);

--
-- Índexs per a les taules bolcades
--

--
-- Índexs per a la taula `aula`
--
ALTER TABLE `aula`
  ADD PRIMARY KEY (`id`);

--
-- Índexs per a la taula `usuari`
--
ALTER TABLE `usuari`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT per les taules bolcades
--

--
-- AUTO_INCREMENT per la taula `aula`
--
ALTER TABLE `aula`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la taula `usuari`
--
ALTER TABLE `usuari`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
