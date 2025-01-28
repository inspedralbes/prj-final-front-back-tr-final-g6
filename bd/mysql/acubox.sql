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
  `Curs` varchar(50) NOT NULL,
  `Classe` varchar(50) NOT NULL,
  `Etapa` enum('ESO','BATX', 'PFI', 'CFGM','CFGS', 'ALTRES') NOT NULL,
  `Planta` int(2) NOT NULL,
  `Aula` varchar(100) NOT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1
  `turn` enum('mati', 'tarda', 'mati i tarda') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `aula`
--

INSERT INTO `aula` (`id`, `Curs`, `Classe`, `Etapa`, `Planta`, `Aula`, `activa`, `turn`) VALUES
(1, 'Aula Dibuix 1', '', 'ALTRES', -2, 'DIB1', 1, 'mati'),
(2, 'Aula Dibuix 2', '', 'ALTRES', -2, 'DIB2', 1, 'mati'),
(3, 'Aula Ed. Fisica', '', 'ALTRES', -2, 'E.F', 1, 'mati'),
(4, 'Taller Hardware', '', 'ALTRES', -2, 'HW', 1, 'mati'),
(5, 'Aula Musica 1', '', 'ALTRES', -2, 'MUS 1', 1, 'mati'),
(6, 'Aula Musica 2', '', 'ALTRES', -2, 'MUS 2', 1, 'mati'),
(7, "Sala d'actes", '', 'ALTRES', -2, '', 0, 'mati'),
(8, '4ESO-A', '4 ESO A', 'ESO', -1, '1', 1, 'mati'),
(9, '4ESO-B', '4 ESO B', 'ESO', -1, '2', 1, 'mati'),
(10, '4ESO-C', '4 ESO C', 'ESO', -1, '3', 1, 'mati'),
(11, '4ESO-D', '4 ESO D', 'ESO', -1, '4', 1, 'mati'),
(12, '', '', 'ESO', -1, '5', 1, 'mati'),
(13, '', '', 'ESO', -1, '6', 1, 'mati'),
(14, '', '', 'ESO', -1, '7', 1, 'mati'),
(15, 'Informatica', '', 'ESO', -1, 'INF', 1, 'mati'),
(16, '', '', 'ESO', -1, 'MEN', 1, 'mati'),
(17, '', '', 'ESO', -1, 'MUL 1', 1, 'mati'),
(18, '', '', 'ESO', -1, 'TEC', 1, 'mati'),
(19, '', 'Aula Robotica', 'ALTRES', -1, '', 0, 'mati'),
(20, '', 'Tecnologia 2', 'ALTRES', -1, '', 0, 'mati'),
(21, '', 'Projecció', 'ALTRES', -1, '', 0, 'mati'),
(22, '1ESO-A', '1 ESO A', 'ESO', 0, '1', 1, 'mati'),
(23, '1ESO-B', '1 ESO B', 'ESO', 0, '2', 1, 'mati'),
(24, '1ESO-C', '1 ESO C', 'ESO', 0, '3', 1, 'mati'),
(25, '1ESO-D', '1 ESO D', 'ESO', 0, '4', 1, 'mati'),
(26, '1ESO-E', '1 ESO E', 'ESO', 0, '5', 1, 'mati'),
(27, 'Aula Acollida', '', 'ALTRES', 0, '6', 1, 'mati'),
(28, '1ESO-F', '1 ESO F', 'ESO', 0, '7', 1, 'mati'),
(29, '1ESO-G', '1 ESO G', 'ESO', 0, '8', 1, 'mati'),
(30, '3ESO-G', '3 ESO G', 'ESO', 0, '9', 1, 'mati'),
(31, '3ESO-H', '3 ESO H', 'ESO', 0, '10', 1, 'mati'),
(32, '4ESO-F', '4 ESO F', 'ESO', 0, '11', 1, 'mati'),
(33, '4ESO-G', '4 ESO G', 'ESO', 0, '12', 1, 'mati'),
(34, '4ESO-H', '4 ESO H', 'ESO', 0, '13', 1, 'mati'),
(35, '4ESO-', '', 'ESO', 0, '14', 1, 'mati'),
(36, '', '', 'ALTRES', 0, 'AMPA 2', 1, 'mati'),
(37, '', '', 'ALTRES', 0, 'AMPA3', 1, 'mati'),
(38, '', 'Consergeria', 'ALTRES', 0, 'CONS', 1, 'mati'),
(39, '', 'BAT / CCFF', 'ALTRES', 0, 'COOR', 1, 'mati'),
(40, '', 'Oficines', 'ALTRES', 0, 'OFI', 1, 'mati'),
(41, '', 'Prefectura', 'ALTRES', 0, '', 0, 'mati'),
(42, '', 'Direcció 1', 'ALTRES', 0, '', 1, 'mati'),
(43, '', 'Direcció 2', 'ALTRES', 0, '', 1, 'mati'),
(44, '', 'Secretaria', 'ALTRES', 0, 'SECRETARIA', 1, 'mati'),
(45, '2ESO-A', '2 ESO A', 'ESO', 1, '1', 1, 'mati'),
(46, '2ESO-B', '2 ESO B', 'ESO', 1, '2', 1, 'mati'),
(47, '2ESO-C', '2 ESO C', 'ESO', 1, '3', 1, 'mati'),
(48, '2ESO-D', '2 ESO D', 'ESO', 1, '4', 1, 'mati'),
(49, '2ESO-E', '2 ESO E', 'ESO', 1, '5', 1, 'mati'),
(50, '2ESO-F', '2 ESO F', 'ESO', 1, '6', 1, 'mati'),
(51, '2ESO-G', '2 ESO G', 'ESO', 1, '6', 1, 'mati'),
(52, '2ESO-H', '2 ESO H', 'ESO', 1, '7', 1, 'mati'),
(53, 'Desdoblament 4', '', 'ALTRES', 1, '9', 1, 'mati'),
(54, '', 'INFO 0', 'ESO', 1, 'INFO 0', 1, 'mati'),
(55, '', 'INFO 2', 'ESO', 1, 'INFO 2', 1, 'mati'),
(56, '', 'INFO 3', 'ESO', 1, 'INFO 3', 1, 'mati'),
(57, '', 'INFO 4', 'ESO', 1, 'INFO 4', 1, 'mati'),
(58, '', 'INFO 5', 'ESO', 1, 'INFO 5', 1, 'mati'),
(59, '', 'INFO 1', 'ESO', 1, 'INFO 1', 1, 'mati'),
(60, '', 'Mulitifuncional 1', 'ALTRES', 1, 'MUL', 1, 'mati'),
(61, '', 'Biblioteca', 'ALTRES', 1, '', 1, 'mati'),
(62, '', 'Sala Professors', 'ALTRES', 1, '', 1, 'mati'),
(63, '', 'Sem. Castellà Boscà', 'ALTRES', 1, '', 1, 'mati'),
(64, '', 'Sem. Castellà Ausiàs', 'ALTRES', 1, '', 1, 'mati'),
(65, '', 'Dpt. Informàtica', 'ALTRES', 1, '', 1, 'mati'),
(66, '', 'Dpt. Tecnologia', 'ALTRES', 1, '', 1, 'mati'),
(67, '3ESO-A', '3 ESO A', 'ESO', 2, '1', 1, 'mati'),
(68, '3ESO-B', '3 ESO B', 'ESO', 2, '2', 1, 'mati'),
(69, '3ESO-C', '3 ESO C', 'ESO', 2, '3', 1, 'mati'),
(70, '3ESO-D', '3 ESO D', 'ESO', 2, '4', 1, 'mati'),
(71, '3ESO-E', '3 ESO E', 'ESO', 2, '5', 1, 'mati'),
(72, '3ESO-F', '3 ESO F', 'ESO', 2, '6', 1, 'mati'),
(73, '', '', 'ESO', 2, '7', 0, 'mati'),
(74, '', '', 'ESO', 2, '8', 0, 'mati'),
(75, '', '', 'ESO', 2, '9', 0, 'mati'),
(76, '1BATX-C', '1 BATXILLERAT C', 'BATX', 2, '10', 1, 'mati'),
(77, '1BATX-D', '1 BATXILLERAT D', 'BATX', 2, '11', 1, 'mati'),
(78, '', 'INFO6', 'ESO', 2, 'INFO6', 1, 'mati'),
(79, '', 'Sem Castellà 2', 'ALTRES', 2, '', 1, 'mati'),
(80, '', 'Sem Castellà 2', 'ALTRES', 2, '', 1, 'mati'),
(81, '', 'Lab Quimica 1', 'ALTRES', 2, '', 1, 'mati'),
(82, '', 'Lab Quimica 2', 'ALTRES', 2, '', 1, 'mati'),
(83, '', 'Lab Fisica 1', 'ALTRES', 2, '', 1, 'mati'),
(84, '', 'Lab Fisica 2', 'ALTRES', 2, '', 1, 'mati'),
(85, '2BTX-A', '2 BATXILLERAT A', 'BATX', 3, '1', 1, 'mati'),
(86, '2BTX-B', '2 BATXILLERAT B', 'BATX', 3, '2', 1, 'mati'),
(87, '2BTX-C', '2 BATXILLERAT C', 'BATX', 3, '3', 1, 'mati'),
(88, '2BTX-D', '2 BATXILLERAT D', 'BATX', 3, '4', 1, 'mati'),
(89, '2BTX-E', '2 BATXILLERAT E', 'BATX', 3, '5', 1, 'mati'),
(90, '2BATX-F', '2 BATXILLERAT F', 'BATX', 3, '6', 1, 'mati'),
(91, '1-BATX-E', '1 BATXILLERAT E', 'BATX', 3, '7', 1, 'mati'),
(92, '1-BATX-F', '1 BATXILLERAT F', 'BATX', 3, '8', 1, 'mati'),
(93, '', 'INFO-10', 'ESO', 3, 'INFO-10', 1, 'mati'),
(94, '', 'INFO7', 'ESO', 3, 'INFO7', 1, 'mati'),
(95, '', 'INFO8', 'ESO', 3, 'INFO8', 1, 'mati'),
(96, '', 'INFO9', 'ESO', 3, 'INFO9', 1, 'mati'),
(97, '', 'Sem Català', 'ALTRES', 3, '', 1, 'mati'),
(98, '', 'dept. lleng. estrangera', 'ALTRES', 3, '', 1, 'mati'),
(99, '', 'dept. matematiques', 'ALTRES', 3, '', 1, 'mati'),
(100, '', 'dept. matematiques', 'ALTRES', 3, '', 1, 'mati'),
(101, '', 'lab ciències naturals', 'ALTRES', 3, '', 1, 'mati'),
(102, '', 'Musica 2', 'ALTRES', 3, '', 1, 'mati'),
(103, '', 'Lab Bio 1', 'ALTRES', 3, '', 1, 'mati'),
(104, '', 'Lab Bio 2', 'ALTRES', 3, '', 1, 'mati'),
(105, '', 'INFO 1', 'CFGS', 3, 'INFO 1', 1, 'tarda');

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
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT per la taula `usuari`
--
ALTER TABLE `usuari`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
