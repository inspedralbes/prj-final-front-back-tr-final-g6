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
  `id` INT(10) AUTO_INCREMENT PRIMARY KEY,
  `Curs` VARCHAR(50) NOT NULL,
  `Classe` VARCHAR(50) NOT NULL,
  `Etapa` ENUM('ESO', 'BATX', 'PFI', 'CFGM', 'CFGS', 'ALTRES') NOT NULL,
  `Planta` INT(2) NOT NULL,
  `Aula` VARCHAR(100) NOT NULL,
  `activa` TINYINT(1) NOT NULL DEFAULT 1,
  `turn` ENUM('mati', 'tarda', 'mati i tarda') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `aula`
--

INSERT INTO `aula` (`id`, `Curs`, `Classe`, `Etapa`, `Planta`, `Aula`, `activa`, `turn`) VALUES
(1, '1ESO-A', '1 ESO A', 'ESO', 0, '1', 1, 'mati'),
(2, '1ESO-B', '1 ESO B', 'ESO', 0, '2', 1, 'mati'),
(3, '1ESO-C', '1 ESO C', 'ESO', 0, '3', 1, 'mati'),
(4, '1ESO-D', '1 ESO D', 'ESO', 0, '4', 1, 'mati'),
(5, '1ESO-E', '1 ESO E', 'ESO', 0, '5', 1, 'mati'),
(6, '1ESO-F', '1 ESO F', 'ESO', 0, '7', 1, 'mati'),
(7, '1ESO-G', '1 ESO G', 'ESO', 0, '8', 1, 'mati'),
(8, '2ESO-A', '2 ESO A', 'ESO', 1, '1', 1, 'mati'),
(9, '2ESO-B', '2 ESO B', 'ESO', 1, '2', 1, 'mati'),
(10, '2ESO-C', '2 ESO C', 'ESO', 1, '3', 1, 'mati'),
(11, '2ESO-D', '2 ESO D', 'ESO', 1, '4', 1, 'mati'),
(12, '2ESO-E', '2 ESO E', 'ESO', 1, '5', 1, 'mati'),
(13, '2ESO-F', '2 ESO F', 'ESO', 1, '6', 1, 'mati'),
(14, '2ESO-G', '2 ESO G', 'ESO', 1, '6', 1, 'mati'),
(15, '2ESO-H', '2 ESO H', 'ESO', 1, '7', 1, 'mati'),
(16, '3ESO-A', '3 ESO A', 'ESO', 2, '1', 1, 'mati'),
(17, '3ESO-B', '3 ESO B', 'ESO', 2, '2', 1, 'mati'),
(18, '3ESO-C', '3 ESO C', 'ESO', 2, '3', 1, 'mati'),
(19, '3ESO-D', '3 ESO D', 'ESO', 2, '4', 1, 'mati'),
(20, '3ESO-E', '3 ESO E', 'ESO', 2, '5', 1, 'mati'),
(21, '3ESO-F', '3 ESO F', 'ESO', 2, '6', 1, 'mati'),
(22, '3ESO-G', '3 ESO G', 'ESO', 0, '9', 1, 'mati'),
(23, '3ESO-H', '3 ESO H', 'ESO', 0, '10', 1, 'mati'),
(24, '4ESO-A', '4 ESO A', 'ESO', -1, '1', 1, 'mati'),
(25, '4ESO-B', '4 ESO B', 'ESO', -1, '2', 1, 'mati'),
(26, '4ESO-C', '4 ESO C', 'ESO', -1, '3', 1, 'mati'),
(27, '4ESO-D', '4 ESO D', 'ESO', -1, '4', 1, 'mati'),
(28, '4ESO-F', '4 ESO F', 'ESO', 0, '11', 1, 'mati'),
(29, '4ESO-G', '4 ESO G', 'ESO', 0, '12', 1, 'mati'),
(30, '4ESO-H', '4 ESO H', 'ESO', 0, '13', 1, 'mati'),
(31, '4ESO-', '', 'ESO', 0, '14', 0, 'mati'),
(32, '1BATX-C', '1 BATXILLERAT C', 'BATX', 2, '10', 1, 'mati'),
(33, '1BATX-D', '1 BATXILLERAT D', 'BATX', 2, '11', 1, 'mati'),
(34, '1BATX-E', '1 BATXILLERAT E', 'BATX', 3, '7', 1, 'mati'),
(35, '1BATX-F', '1 BATXILLERAT F', 'BATX', 3, '8', 1, 'mati'),
(36, '2BATX-A', '2 BATXILLERAT A', 'BATX', 3, '1', 1, 'mati'),
(37, '2BATX-B', '2 BATXILLERAT B', 'BATX', 3, '2', 1, 'mati'),
(38, '2BATX-C', '2 BATXILLERAT C', 'BATX', 3, '3', 1, 'mati'),
(39, '2BATX-D', '2 BATXILLERAT D', 'BATX', 3, '4', 1, 'mati'),
(40, '2BATX-E', '2 BATXILLERAT E', 'BATX', 3, '5', 1, 'mati'),
(41, '2BATX-F', '2 BATXILLERAT F', 'BATX', 3, '6', 1, 'mati'),
(42, 'PFI', 'INFO 0', 'PFI', 1, 'INFO 0', 1, 'mati'),
(43, '1 SMX A1', 'INFO 1', 'CFGM', 1, 'INFO 1', 1, 'mati'),
(44, '1 SMX A2', 'INFO 2', 'CFGM', 1, 'INFO 2', 1, 'mati'),
(45, '1 SMX A3', 'INFO 3', 'CFGM', 1, 'INFO 3', 1, 'mati'),
(46, '1 SMX A4', 'INFO 4', 'CFGM', 1, 'INFO 4', 1, 'mati'),
(47, '1 SMX B2', 'INFO 6', 'CFGM', 2, 'INFO 6', 1, 'tarda'),
(48, '2 SMX A1', 'INFO 5', 'CFGM', 1, 'INFO 5', 1, 'mati'),
(49, 'SMX B', 'INFO 9', 'CFGM', 3, 'INFO 9', 1, 'mati'),
(50, '2 SMX A2', 'INFO 9', 'CFGM', 3, 'INFO 9', 1, 'tarda'),
(51, '2 SMX A3', 'INFO 11', 'CFGM', 3, 'INFO 11', 1, 'mati'),
(52, '1 DAW', 'INFO 10', 'CFGS', 3, 'INFO 10', 1, 'mati'),
(53, '2 DAW', 'INFO 7', 'CFGS', 3, 'INFO 7', 1, 'mati'),
(54, '1 DAM', 'INFO 6', 'CFGS', 3, 'INFO 6', 1, 'mati'),
(55, '2 DAM', 'INFO 8', 'CFGS', 3, 'INFO 8', 1, 'mati'),
(56, '1 ASIX CIBERSEGURETAT', 'INFO 10', 'CFGS', 3, 'INFO 10', 1, 'tarda'),
(57, '1 ASIX CIBERSEGURETAT B2', 'INFO 11', 'CFGS', 3, 'INFO 11', 1, 'tarda'),
(58, '2 ASIX', 'INFO 7', 'CFGS', 3, 'INFO 7', 1, 'tarda'),
(59, '2 ASIX', 'INFO 8', 'CFGS', 3, 'INFO 8', 1, 'tarda'),
(60, '1 DAMVI', 'INFO 2', 'CFGS', 3, 'INFO 2', 1, 'tarda'),
(61, '2 DAMVI', 'INFO 1', 'CFGS', 3, 'INFO 1', 1, 'tarda'),
(62, '1 A3D', 'INFO 3', 'CFGS', 3, 'INFO 3', 1, 'tarda'),
(63, '2 A3D', 'INFO 5', 'CFGS', 3, 'INFO 5', 1, 'tarda'),
(64, 'CEFP Videojocs i Realitat Virutal', 'INFO 4', 'CFGS', 3, 'INFO 4', 1, 'tarda'),
(65, 'Aula Dibuix 1', '', 'ALTRES', -2, 'DIB1', 1, 'mati'),
(66, 'Aula Dibuix 2', '', 'ALTRES', -2, 'DIB2', 1, 'mati'),
(67, 'Aula Ed. Fisica', '', 'ALTRES', -2, 'E.F', 1, 'mati'),
(68, 'Taller Hardware', '', 'ALTRES', -2, 'HW', 1, 'mati'),
(69, 'Aula Musica 1', '', 'ALTRES', -2, 'MUS 1', 1, 'mati'),
(70, 'Aula Musica 2', '', 'ALTRES', -2, 'MUS 2', 1, 'mati'),
(71, "Sala d'actes", '', 'ALTRES', -2, '', 0, 'mati i tarda'),
(72, '', 'Aula Robotica', 'ALTRES', -1, '', 0, 'mati'),
(73, '', 'Tecnologia 2', 'ALTRES', -1, '', 0, 'mati'),
(74, '', 'Projecció', 'ALTRES', -1, '', 0, 'mati'),
(75, 'Aula Acollida', '', 'ALTRES', 0, '6', 1, 'mati'),
(76, '', '', 'ALTRES', 0, 'AMPA 2', 0, 'mati'),
(77, '', '', 'ALTRES', 0, 'AMPA3', 0, 'mati'),
(78, '', 'Consergeria', 'ALTRES', 0, 'CONS', 1, 'mati i tarda'),
(79, '', 'BAT / CCFF', 'ALTRES', 0, 'COOR', 1, 'mati'),
(80, '', 'Oficines', 'ALTRES', 0, 'OFI', 1, 'mati i tarda'),
(81, '', 'Prefectura', 'ALTRES', 0, '', 1, 'mati'),
(82, '', 'Direcció 1', 'ALTRES', 0, '', 1, 'mati i tarda'),
(83, '', 'Direcció 2', 'ALTRES', 0, '', 1, 'mati i tarda'),
(84, '', 'Secretaria', 'ALTRES', 0, 'SECRETARIA', 1, 'mati i tarda'),
(85, 'Desdoblament 4', '', 'ALTRES', 1, '9', 1, 'mati'),
(86, '', 'Mulitifuncional 1', 'ALTRES', 1, 'MUL', 1, 'mati'),
(87, '', 'Biblioteca', 'ALTRES', 1, '', 1, 'mati i tarda'),
(88, '', 'Sala Professors', 'ALTRES', 1, '', 1, 'mati i tarda'),
(89, '', 'Sem. Castellà Boscà', 'ALTRES', 1, '', 1, 'mati'),
(90, '', 'Sem. Castellà Ausiàs', 'ALTRES', 1, '', 1, 'mati'),
(91, '', 'Dpt. Informàtica', 'ALTRES', 1, '', 1, 'mati'),
(92, '', 'Dpt. Tecnologia', 'ALTRES', 1, '', 1, 'mati'),
(93, '', 'Sem Castellà 2', 'ALTRES', 2, '', 1, 'mati'),
(94, '', 'Sem Castellà 2', 'ALTRES', 2, '', 1, 'mati'),
(95, '', 'Lab Quimica 1', 'ALTRES', 2, '', 1, 'mati'),
(96, '', 'Lab Quimica 2', 'ALTRES', 2, '', 1, 'mati'),
(97, '', 'Lab Fisica 1', 'ALTRES', 2, '', 1, 'mati'),
(98, '', 'Lab Fisica 2', 'ALTRES', 2, '', 1, 'mati'),
(99, '', 'Sem Català', 'ALTRES', 3, '', 1, 'mati'),
(100, '', 'dept. lleng. estrangera', 'ALTRES', 3, '', 1, 'mati'),
(101, '', 'dept. matematiques', 'ALTRES', 3, '', 1, 'mati'),
(102, '', 'dept. matematiques', 'ALTRES', 3, '', 1, 'mati'),
(103, '', 'lab ciències naturals', 'ALTRES', 3, '', 1, 'mati'),
(104, '', 'Musica 2', 'ALTRES', 3, '', 1, 'mati'),
(105, '', 'Lab Bio 1', 'ALTRES', 3, '', 1, 'mati'),
(106, '', 'Lab Bio 2', 'ALTRES', 3, '', 1, 'mati'),
(107, 'Informatica', '', 'ALTRES', -1, 'INF', 0, 'mati'),
(108, '', '', 'ALTRES', -1, '5', 0, 'mati'),
(109, '', '', 'ALTRES', -1, '6', 0, 'mati'),
(110, '', '', 'ALTRES', -1, '7', 0, 'mati'),
(111, '', '', 'ALTRES', -1, 'MEN', 0, 'mati'),
(112, '', '', 'ALTRES', -1, 'MUL 1', 0, 'mati'),
(113, '', '', 'ALTRES', -1, 'TEC', 0, 'mati'),
(114, '', '', 'ALTRES', 2, '7', 0, 'mati'),
(115, '', '', 'ALTRES', 2, '8', 0, 'mati'),
(116, '', '', 'ALTRES', 2, '9', 0, 'mati');

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

-- Crear tabla `sensor` (si aún no existe)
CREATE TABLE `sensor` (
  `idSensor` INT(10) AUTO_INCREMENT PRIMARY KEY,
  `mac` VARCHAR(100) NOT NULL,
  `api_key` VARCHAR(255),
  `nombre` VARCHAR(100) NOT NULL,  -- Ejemplo de columna adicional
  `ubicacion` VARCHAR(100) NOT NULL,  -- Ejemplo de columna adicional
  `x` INT NOT NULL,  -- Coordenada x del sensor
  `y` INT NOT NULL,  -- Coordenada y del sensor
  `idAula` INT,
  FOREIGN KEY (`idAula`) REFERENCES `aula`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `newsensor` (si aún no existe)
CREATE TABLE `newsensor` (
  `idSensor` INT(10) AUTO_INCREMENT PRIMARY KEY,
  `mac` VARCHAR(100) NOT NULL,
  `ip_sensor` VARCHAR(255),
  `accepted` BOOLEAN NOT NULL DEFAULT 0,
  `banned` BOOLEAN NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `minuto`
CREATE TABLE `minut` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `idAula` INT NOT NULL,
  `idSensor` INT NOT NULL,
  `tipus` ENUM('volum', 'temperatura', 'co2') NOT NULL,
  `max` FLOAT NOT NULL,
  `min` FLOAT NOT NULL,
  `average` FLOAT NOT NULL,
  `dataIni` VARCHAR(255) NOT NULL,
  `dataFi` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`idAula`) REFERENCES `aula`(`id`),
  FOREIGN KEY (`idSensor`) REFERENCES `sensor`(`idSensor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `hora`
CREATE TABLE `hora` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `idAula` INT NOT NULL,
  `idSensor` INT NOT NULL,
  `tipus` ENUM('volum', 'temperatura', 'co2') NOT NULL,
  `max` FLOAT NOT NULL,
  `min` FLOAT NOT NULL,
  `average` FLOAT NOT NULL,
  `dataIni` VARCHAR(255) NOT NULL,
  `dataFi` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`idAula`) REFERENCES `aula`(`id`),
  FOREIGN KEY (`idSensor`) REFERENCES `sensor`(`idSensor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `dias`
CREATE TABLE `dia` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `idAula` INT NOT NULL,
  `idSensor` INT NOT NULL,
  `tipus` ENUM('volum', 'temperatura', 'co2') NOT NULL,
  `max` FLOAT NOT NULL,
  `min` FLOAT NOT NULL,
  `average` FLOAT NOT NULL,
  `dataIni` VARCHAR(255) NOT NULL,
  `dataFi` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`idAula`) REFERENCES `aula`(`id`),
  FOREIGN KEY (`idSensor`) REFERENCES `sensor`(`idSensor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `semana`
CREATE TABLE `setmana` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `idAula` INT NOT NULL,
  `idSensor` INT NOT NULL,
  `tipus` ENUM('volum', 'temperatura', 'co2') NOT NULL,
  `max` FLOAT NOT NULL,
  `min` FLOAT NOT NULL,
  `average` FLOAT NOT NULL,
  `dataIni` VARCHAR(255) NOT NULL,
  `dataFi` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`idAula`) REFERENCES `aula`(`id`),
  FOREIGN KEY (`idSensor`) REFERENCES `sensor`(`idSensor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `mes`
CREATE TABLE `mes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `idAula` INT NOT NULL,
  `idSensor` INT NOT NULL,
  `tipus` ENUM('volum', 'temperatura', 'co2') NOT NULL,
  `max` FLOAT NOT NULL,
  `min` FLOAT NOT NULL,
  `average` FLOAT NOT NULL,
  `dataIni` VARCHAR(255) NOT NULL,
  `dataFi` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`idAula`) REFERENCES `aula`(`id`),
  FOREIGN KEY (`idSensor`) REFERENCES `sensor`(`idSensor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla `curso`
CREATE TABLE `curs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `idAula` INT NOT NULL,
  `idSensor` INT NOT NULL,
  `tipus` ENUM('volum', 'temperatura', 'co2') NOT NULL,
  `max` FLOAT NOT NULL,
  `min` FLOAT NOT NULL,
  `average` FLOAT NOT NULL,
  `dataIni` VARCHAR(255) NOT NULL,
  `dataFi` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`idAula`) REFERENCES `aula`(`id`),
  FOREIGN KEY (`idSensor`) REFERENCES `sensor`(`idSensor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `usuari`
--

INSERT INTO `usuari` (`id`, `nom`, `correu`, `contrasenya`, `admin`) VALUES
(1, 'admin', 'admin@admin.com', 'admin', 1),
(2, 'professor', 'prof@prof.com', 'prof', 0);

INSERT INTO `dia` (`id`, `idAula`, `idSensor`, `tipus`, `max`, `min`, `average`, `dataIni`, `dataFi`) VALUES
(1, 1, 1, 'volum', 30, 10, 20, '2025-02-10 00:00:00', '2025-02-11 00:00:00'),
(2, 1, 1, 'volum', 100, 50, 75, '2025-02-11 00:00:00', '2025-02-12 00:00:00'),
(3, 1, 1, 'volum', 50, 2, 34, '2025-02-12 00:00:00', '2025-02-13 00:00:00'),
(4, 1, 1, 'volum', 38, 12, 20, '2025-02-13 00:00:00', '2025-02-14 00:00:00'),
(5, 1, 1, 'volum', 100, 50, 75, '2025-02-14 00:00:00', '2025-02-15 00:00:00');

INSERT INTO `sensor` (`idSensor`, `mac`, `nombre`, `ubicacion`, `x`, `y`, `idAula`, `api_key`) VALUES
(1, 'MAC1', 'sensor1', 'aula1', 1, 1, 1, NULL),
(2, 'MAC2', 'sensor2', 'aula1', 2, 2, 1, NULL),
(3, 'MAC3', 'sensor3', 'aula1', 3, 3, 1, 'API_KEY3'),
(4, 'MAC4', 'sensor4', 'aula1', 4, 4, 1, 'API_KEY4'),
(5, 'MAC5', 'sensor5', 'aula1', 5, 5, 1, 'API_KEY5'),
(6, 'MAMAMAM', 'sensor6', 'aula1', 6, 6, 1, 'c8nlsy4955ju75tq5w3f');
INSERT INTO `sensor` (`idSensor`, `mac`, `nombre`, `ubicacion`, `x`, `y`, `idAula`, `api_key`) VALUES
(1, 'MAC1', 'sensor1', 'aula1', 1, 1, 1, NULL),
(2, 'MAC2', 'sensor2', 'aula1', 2, 2, 1, NULL),
(3, 'MAC3', 'sensor3', 'aula1', 3, 3, 1, 'API_KEY3'),
(4, 'MAC4', 'sensor4', 'aula1', 4, 4, 1, 'API_KEY4'),
(5, 'MAC5', 'sensor5', 'aula1', 5, 5, 1, 'API_KEY5'),
(6, 'MAMAMAM', 'sensor6', 'aula1', 6, 6, 1, 'c8nlsy4955ju75tq5w3f');

INSERT INTO `newsensor` (`idSensor`, `mac`, `ip_sensor`, `accepted`, `banned`) VALUES
(1, 'MAC1', '192.168.1.1', 0, 0),
(2, 'MAC2', '192.168.1.1', 0, 0),
(3, 'MAC3', '192.168.1.1', 0, 0),
(4, 'MAC4', '192.168.1.1', 0, 0);
--
-- Índexs per a les taules bolcades
--

--
-- Índexs per a la taula `aula`
--
-- ALTER TABLE `aula`
--   ADD PRIMARY KEY (`id`);

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