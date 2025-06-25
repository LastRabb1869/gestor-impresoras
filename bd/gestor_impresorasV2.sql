-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-06-2025 a las 09:19:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestor_impresoras`
--
DROP DATABASE IF EXISTS `gestor_impresoras`;
CREATE DATABASE IF NOT EXISTS `gestor_impresoras` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `gestor_impresoras`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alertas`
--

CREATE TABLE `alertas` (
  `id` int(11) NOT NULL,
  `impresora_id` int(11) NOT NULL,
  `prioridad` enum('ALTA','MEDIA','BAJA','FALSA ALARMA') NOT NULL,
  `direccion_ip` varchar(15) NOT NULL,
  `reporte` text NOT NULL,
  `estado_actual` enum('COMPLETADO','EN PROCESO','SIN ARREGLO') NOT NULL DEFAULT 'EN PROCESO',
  `fecha_reportado` date NOT NULL DEFAULT current_timestamp(),
  `fecha_concluido` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alertas`
--

INSERT INTO `alertas` (`id`, `impresora_id`, `prioridad`, `direccion_ip`, `reporte`, `estado_actual`, `fecha_reportado`, `fecha_concluido`) VALUES
(1, 2, 'MEDIA', '10.180.0.41', 'Esta es una prueba y eventualmente se eliminará.', 'COMPLETADO', '2025-06-18', '2025-06-24'),
(2, 5, 'ALTA', '10.180.0.157', 'Se tiene que cambiar el toner.', 'COMPLETADO', '2025-06-22', '2025-06-24'),
(3, 6, 'BAJA', '10.180.0.131', 'Sobrecalentamiento y falla en el cable de la fuente.', 'EN PROCESO', '2025-06-24', '2025-06-25'),
(5, 7, 'ALTA', '10.180.0.174', 'Esta es otra prueba y error', 'EN PROCESO', '2025-06-24', NULL),
(6, 5, 'MEDIA', '10.180.0.157', 'Esta es una segunda prueba y a ver cómo sale.', 'EN PROCESO', '2025-06-25', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cambios`
--

CREATE TABLE `cambios` (
  `id` int(11) NOT NULL,
  `impresora_id` int(11) NOT NULL,
  `componente_id` int(11) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cambios`
--

INSERT INTO `cambios` (`id`, `impresora_id`, `componente_id`, `descripcion`, `fecha_hora`) VALUES
(1, 2, 3, 'Se le acabó el tonner y se le vuelve a poner más.', '2025-06-18 18:38:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `componentes`
--

CREATE TABLE `componentes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `num_serie` varchar(50) NOT NULL,
  `cantidad_stock` int(11) NOT NULL DEFAULT 0,
  `estado` enum('EXCELENTES CONDICIONES','POSIBLE FALLO','BAJA DEFINITIVA','DESCONOCIDO','SIN STOCK') NOT NULL DEFAULT 'EXCELENTES CONDICIONES',
  `ubicacion_id` int(11) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `componentes`
--

INSERT INTO `componentes` (`id`, `nombre`, `marca`, `num_serie`, `cantidad_stock`, `estado`, `ubicacion_id`, `imagen`) VALUES
(3, 'Toner', 'Patito', '04JA-XW10D', 1, 'EXCELENTES CONDICIONES', 1, 'toner1.png'),
(4, 'Rollo térmico', 'Roll Up', 'EIGL920827A63', 3, 'POSIBLE FALLO', 1, 'z8a3munq.png'),
(5, 'PLACA MADRE', 'EPSON', 'OR2MA1', 2, 'POSIBLE FALLO', 1, 'img_685adc1569cd29.12331717.png'),
(6, 'MEMORIA RAM', 'CRUCIAL', 'CT00X-DR4812', 4, '', 2, 'img_685ae80bac4097.24087363.png'),
(7, 'PROCESADOR INTEL', 'INTEL', 'COREi5-10400', 1, '', 1, 'img_685ae9164a6fc0.95755425.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `impresoras`
--

CREATE TABLE `impresoras` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `num_serie` varchar(50) NOT NULL,
  `direccion_ip` varchar(15) NOT NULL,
  `estado` enum('FUNCIONANDO','CON PROBLEMAS','REPARANDO','BAJA') NOT NULL DEFAULT 'FUNCIONANDO',
  `ubicacion_id` int(11) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `impresoras`
--

INSERT INTO `impresoras` (`id`, `nombre`, `marca`, `modelo`, `num_serie`, `direccion_ip`, `estado`, `ubicacion_id`, `imagen`) VALUES
(1, 'RIC-82', 'RICOH', 'IM 430F', 'S-48372', '10.4.67.71', 'FUNCIONANDO', 1, 'ricoh1.png'),
(2, 'RICKY', 'RICOH', 'IM 430F', 'TLR-852ALX', '10.180.0.41', 'CON PROBLEMAS', 2, 'ricoh2.png'),
(5, 'PPDC CONCIERGE2', 'EPSON', 'L3250', 'JDK_AL81', '10.180.0.157', 'CON PROBLEMAS', 1, 'img_6854e04e5e7d63.21169004.png'),
(6, 'BACK LA PERLA', 'EPSON', 'L1250', 'GKW34_91A', '10.180.0.131', 'REPARANDO', 1, 'img_6854e127778a27.65096094.png'),
(7, 'HP FAHRENHEIT', 'HP', 'Office Jet Pro 9730', 'JFE-139AD', '10.180.0.174', 'FUNCIONANDO', 1, 'img_6855d48347c545.91674503.jpeg'),
(9, 'CANON CLUB MELIA', 'CANON', 'PIXMA G3110', 'DX-L14S42A', '10.180.0.184', 'BAJA', 1, 'img_6856665e0fd4b6.91990062.png'),
(10, 'IMPRESORA BAMBU LAB', 'BAMBU LAB', 'X1E', '3DM-BAMBULABX1E', '10.180.0.148', 'FUNCIONANDO', 2, 'img_685af6d8a8a862.23496348.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `responsables`
--

CREATE TABLE `responsables` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `ubicacion_id` int(11) NOT NULL,
  `estado` enum('ALTA','BAJA') NOT NULL DEFAULT 'ALTA',
  `imagen_perfil` varchar(255) DEFAULT NULL,
  `archivo` varchar(255) DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicaciones`
--

CREATE TABLE `ubicaciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` enum('SITE','BAR','HELADERIA','LOBBY','OFICINA','OTRO') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ubicaciones`
--

INSERT INTO `ubicaciones` (`id`, `nombre`, `tipo`) VALUES
(1, 'SITE 1', 'SITE'),
(2, 'MODULO A', 'SITE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `num_colaborador` char(4) NOT NULL,
  `nivel` enum('IT','Admin IT') NOT NULL DEFAULT 'IT',
  `contrasena` varchar(255) NOT NULL,
  `imagen_perfil` varchar(255) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `correo`, `num_colaborador`, `nivel`, `contrasena`, `imagen_perfil`) VALUES
(1, 'Juan Manuel ', 'Peña Gómez', 'juanp@melia.com', '5854', 'IT', '$2y$10$19DjBLOh98.cRInQk5Nche58BJ8HM2d9iWZY6VFQHF3Cg0WdO9ec6', 'hola mundo'),
(3, 'Ameridio', 'Paulatino Esparra', 'ameridio.paulatino@melia.com', '7736', 'IT', '$2y$10$1vWykPAOjnrqDCkS6E/.1.POj6ngIoDUIckHL2mm.Ku4IPz5xen5K', NULL),
(4, 'Constantino', 'Hernando Pérez', 'constantino.hernando@melia.com', '8104', 'IT', '$2y$10$tYV9g5Uyk46t4aH8IE7caeQKhnmHw7Ly3kbIpFC7B573pE/2gEOqO', NULL),
(5, 'Meridiano', 'Austino Carrera', 'meridiano.carrera@melia.com', '3897', 'IT', '$2y$10$utNGo9y3DgLYsq.EBC/gEumOe2IyTkWBVr45VhKsIWJa1eSxS///e', NULL),
(6, 'Emilio Santino', 'De la Cruz Córdoba', 'emilio.santino@melia.com', '1277', 'Admin IT', '$2y$10$HcTZqAm/YS6bFHnOpPZCo.HFoRP4QegpUvaZjfEOQGbNqu7tZT/3S', NULL),
(8, 'Gabriela Hernández', 'Solovino Reyes', 'gabriela.solovino@melia.com', '4381', 'Admin IT', '$2y$10$tI70cXX2XWoVinbhcuINduWp11RpUxCDiyt3kyG5V3SjWVaeLVNjO', 'f_perfil1.jpeg');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alertas`
--
ALTER TABLE `alertas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `impresora_id` (`impresora_id`);

--
-- Indices de la tabla `cambios`
--
ALTER TABLE `cambios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `impresora_id` (`impresora_id`),
  ADD KEY `componente_id` (`componente_id`);

--
-- Indices de la tabla `componentes`
--
ALTER TABLE `componentes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `num_serie` (`num_serie`),
  ADD KEY `ubicacion_id` (`ubicacion_id`);

--
-- Indices de la tabla `impresoras`
--
ALTER TABLE `impresoras`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `num_serie` (`num_serie`),
  ADD KEY `ubicacion_id` (`ubicacion_id`);

--
-- Indices de la tabla `responsables`
--
ALTER TABLE `responsables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_responsables_ubicacion` (`ubicacion_id`);

--
-- Indices de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD UNIQUE KEY `num_colaborador` (`num_colaborador`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alertas`
--
ALTER TABLE `alertas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `cambios`
--
ALTER TABLE `cambios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `componentes`
--
ALTER TABLE `componentes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `impresoras`
--
ALTER TABLE `impresoras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `responsables`
--
ALTER TABLE `responsables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alertas`
--
ALTER TABLE `alertas`
  ADD CONSTRAINT `alertas_ibfk_1` FOREIGN KEY (`impresora_id`) REFERENCES `impresoras` (`id`);

--
-- Filtros para la tabla `cambios`
--
ALTER TABLE `cambios`
  ADD CONSTRAINT `cambios_ibfk_1` FOREIGN KEY (`impresora_id`) REFERENCES `impresoras` (`id`),
  ADD CONSTRAINT `cambios_ibfk_2` FOREIGN KEY (`componente_id`) REFERENCES `componentes` (`id`);

--
-- Filtros para la tabla `componentes`
--
ALTER TABLE `componentes`
  ADD CONSTRAINT `componentes_ibfk_1` FOREIGN KEY (`ubicacion_id`) REFERENCES `ubicaciones` (`id`);

--
-- Filtros para la tabla `impresoras`
--
ALTER TABLE `impresoras`
  ADD CONSTRAINT `impresoras_ibfk_1` FOREIGN KEY (`ubicacion_id`) REFERENCES `ubicaciones` (`id`);

--
-- Filtros para la tabla `responsables`
--
ALTER TABLE `responsables`
  ADD CONSTRAINT `fk_responsables_ubicacion` FOREIGN KEY (`ubicacion_id`) REFERENCES `ubicaciones` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
