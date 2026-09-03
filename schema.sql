-- MySQL dump 10.13  Distrib 8.4.11, for Win64 (x86_64)
--
-- Host: localhost    Database: centros_acopio
-- ------------------------------------------------------
-- Server version	8.4.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `articulos`
--

DROP TABLE IF EXISTS `articulos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articulos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `categoria` varchar(80) NOT NULL,
  `unidad_medida` varchar(40) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_articulos_nombre_unidad` (`nombre`,`unidad_medida`),
  CONSTRAINT `chk_articulos_activo` CHECK ((`activo` in (0,1))),
  CONSTRAINT `chk_articulos_categoria` CHECK ((trim(`categoria`) <> _cp850'')),
  CONSTRAINT `chk_articulos_nombre` CHECK ((trim(`nombre`) <> _cp850'')),
  CONSTRAINT `chk_articulos_unidad` CHECK ((trim(`unidad_medida`) <> _cp850''))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `campanas`
--

DROP TABLE IF EXISTS `campanas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campanas` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_campanas_nombre_inicio` (`nombre`,`fecha_inicio`),
  CONSTRAINT `chk_campanas_activo` CHECK ((`activo` in (0,1))),
  CONSTRAINT `chk_campanas_fechas` CHECK ((`fecha_fin` >= `fecha_inicio`))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `centros`
--

DROP TABLE IF EXISTS `centros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `centros` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `institucion` varchar(120) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `estado` varchar(100) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_centros_nombre_institucion` (`nombre`,`institucion`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `centros_campanas`
--

DROP TABLE IF EXISTS `centros_campanas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `centros_campanas` (
  `centro_id` int unsigned NOT NULL,
  `campana_id` int unsigned NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_asignacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`centro_id`,`campana_id`),
  KEY `fk_cc_campana` (`campana_id`),
  CONSTRAINT `fk_cc_campana` FOREIGN KEY (`campana_id`) REFERENCES `campanas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_cc_centro` FOREIGN KEY (`centro_id`) REFERENCES `centros` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_cc_activo` CHECK ((`activo` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `donantes`
--

DROP TABLE IF EXISTS `donantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donantes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) DEFAULT NULL,
  `telefono` varchar(25) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_donantes_datos` CHECK ((((`nombre` is not null) and (trim(`nombre`) <> _utf8mb4'')) or ((`telefono` is not null) and (trim(`telefono`) <> _utf8mb4''))))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `entregas`
--

DROP TABLE IF EXISTS `entregas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entregas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `movimiento_id` bigint unsigned NOT NULL,
  `estado` varchar(25) NOT NULL DEFAULT 'pendiente',
  `fecha_asignacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_confirmacion` datetime DEFAULT NULL,
  `confirmado_por_usuario_id` int unsigned DEFAULT NULL,
  `observaciones_confirmacion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_entregas_movimiento` (`movimiento_id`),
  KEY `fk_entregas_usuario_confirmacion` (`confirmado_por_usuario_id`),
  KEY `idx_entregas_estado` (`estado`),
  CONSTRAINT `fk_entregas_movimiento` FOREIGN KEY (`movimiento_id`) REFERENCES `movimientos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_entregas_usuario_confirmacion` FOREIGN KEY (`confirmado_por_usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `chk_entregas_confirmacion` CHECK ((((`estado` = _utf8mb4'pendiente') and (`fecha_confirmacion` is null) and (`confirmado_por_usuario_id` is null)) or ((`estado` = _utf8mb4'confirmada') and (`fecha_confirmacion` is not null) and (`confirmado_por_usuario_id` is not null)))),
  CONSTRAINT `chk_entregas_estado` CHECK ((`estado` in (_utf8mb4'pendiente',_utf8mb4'confirmada')))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `instituciones_receptoras`
--

DROP TABLE IF EXISTS `instituciones_receptoras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instituciones_receptoras` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `contacto_nombre` varchar(120) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `telefono` varchar(25) DEFAULT NULL,
  `direccion` varchar(200) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `estado` varchar(100) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_instituciones_correo` (`correo`),
  CONSTRAINT `chk_instituciones_activo` CHECK ((`activo` in (0,1))),
  CONSTRAINT `chk_instituciones_contacto` CHECK ((trim(`contacto_nombre`) <> _utf8mb4'')),
  CONSTRAINT `chk_instituciones_correo` CHECK ((trim(`correo`) <> _utf8mb4'')),
  CONSTRAINT `chk_instituciones_nombre` CHECK ((trim(`nombre`) <> _utf8mb4''))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `movimientos`
--

DROP TABLE IF EXISTS `movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `campana_id` int unsigned NOT NULL,
  `centro_id` int unsigned NOT NULL,
  `articulo_id` int unsigned NOT NULL,
  `usuario_id` int unsigned NOT NULL,
  `tipo` varchar(30) NOT NULL,
  `cantidad` decimal(15,3) NOT NULL,
  `donante_id` int unsigned DEFAULT NULL,
  `institucion_id` int unsigned DEFAULT NULL,
  `transferencia_id` bigint unsigned DEFAULT NULL,
  `motivo` varchar(500) DEFAULT NULL,
  `fecha_movimiento` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_movimiento_transferencia_articulo_tipo` (`transferencia_id`,`articulo_id`,`tipo`),
  KEY `fk_movimientos_centro_campana` (`centro_id`,`campana_id`),
  KEY `fk_movimientos_articulo` (`articulo_id`),
  KEY `fk_movimientos_usuario` (`usuario_id`),
  KEY `fk_movimientos_donante` (`donante_id`),
  KEY `fk_movimientos_institucion` (`institucion_id`),
  KEY `idx_movimientos_stock` (`campana_id`,`centro_id`,`articulo_id`,`tipo`),
  KEY `idx_movimientos_fecha` (`fecha_movimiento`),
  CONSTRAINT `fk_movimientos_articulo` FOREIGN KEY (`articulo_id`) REFERENCES `articulos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_movimientos_centro_campana` FOREIGN KEY (`centro_id`, `campana_id`) REFERENCES `centros_campanas` (`centro_id`, `campana_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_movimientos_donante` FOREIGN KEY (`donante_id`) REFERENCES `donantes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_movimientos_institucion` FOREIGN KEY (`institucion_id`) REFERENCES `instituciones_receptoras` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_movimientos_transferencia` FOREIGN KEY (`transferencia_id`) REFERENCES `transferencias` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_movimientos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `chk_movimientos_cantidad` CHECK ((`cantidad` > 0)),
  CONSTRAINT `chk_movimientos_donante` CHECK (((`tipo` = _utf8mb4'recepcion') or (`donante_id` is null))),
  CONSTRAINT `chk_movimientos_institucion` CHECK ((((`tipo` = _utf8mb4'entrega') and (`institucion_id` is not null)) or ((`tipo` <> _utf8mb4'entrega') and (`institucion_id` is null)))),
  CONSTRAINT `chk_movimientos_motivo` CHECK (((`tipo` not in (_utf8mb4'merma',_utf8mb4'ajuste_positivo',_utf8mb4'ajuste_negativo')) or ((`motivo` is not null) and (trim(`motivo`) <> _utf8mb4'')))),
  CONSTRAINT `chk_movimientos_tipo` CHECK ((`tipo` in (_utf8mb4'recepcion',_utf8mb4'entrega',_utf8mb4'merma',_utf8mb4'transferencia_entrada',_utf8mb4'transferencia_salida',_utf8mb4'ajuste_positivo',_utf8mb4'ajuste_negativo'))),
  CONSTRAINT `chk_movimientos_transferencia` CHECK ((((`tipo` in (_utf8mb4'transferencia_entrada',_utf8mb4'transferencia_salida')) and (`transferencia_id` is not null)) or ((`tipo` not in (_utf8mb4'transferencia_entrada',_utf8mb4'transferencia_salida')) and (`transferencia_id` is null))))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_movimientos_no_update` BEFORE UPDATE ON `movimientos` FOR EACH ROW BEGIN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Los movimientos historicos no pueden modificarse';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_movimientos_no_delete` BEFORE DELETE ON `movimientos` FOR EACH ROW BEGIN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Los movimientos historicos no pueden eliminarse';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transferencias`
--

DROP TABLE IF EXISTS `transferencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transferencias` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `campana_id` int unsigned NOT NULL,
  `centro_origen_id` int unsigned NOT NULL,
  `centro_destino_id` int unsigned NOT NULL,
  `usuario_id` int unsigned NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'pendiente',
  `motivo` varchar(255) DEFAULT NULL,
  `fecha_transferencia` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_transferencias_campana` (`campana_id`),
  KEY `fk_transferencias_usuario` (`usuario_id`),
  KEY `fk_transferencias_origen_campana` (`centro_origen_id`,`campana_id`),
  KEY `fk_transferencias_destino_campana` (`centro_destino_id`,`campana_id`),
  CONSTRAINT `fk_transferencias_destino_campana` FOREIGN KEY (`centro_destino_id`, `campana_id`) REFERENCES `centros_campanas` (`centro_id`, `campana_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_transferencias_origen_campana` FOREIGN KEY (`centro_origen_id`, `campana_id`) REFERENCES `centros_campanas` (`centro_id`, `campana_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_transferencias_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `chk_transferencias_centros` CHECK ((`centro_origen_id` <> `centro_destino_id`)),
  CONSTRAINT `chk_transferencias_estado` CHECK ((`estado` in (_utf8mb4'pendiente',_utf8mb4'completada',_utf8mb4'cancelada')))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol_id` tinyint unsigned NOT NULL,
  `centro_id` int unsigned DEFAULT NULL,
  `institucion_id` int unsigned DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `intentos_fallidos` tinyint unsigned NOT NULL DEFAULT '0',
  `bloqueado_hasta` datetime DEFAULT NULL,
  `ultimo_acceso` datetime DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_correo` (`correo`),
  KEY `fk_usuarios_rol` (`rol_id`),
  KEY `fk_usuarios_centro` (`centro_id`),
  KEY `fk_usuarios_institucion` (`institucion_id`),
  CONSTRAINT `fk_usuarios_centro` FOREIGN KEY (`centro_id`) REFERENCES `centros` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_usuarios_institucion` FOREIGN KEY (`institucion_id`) REFERENCES `instituciones_receptoras` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `chk_usuarios_activo` CHECK ((`activo` in (0,1))),
  CONSTRAINT `chk_usuarios_asignacion` CHECK (((`centro_id` is null) or (`institucion_id` is null))),
  CONSTRAINT `chk_usuarios_correo` CHECK ((trim(`correo`) <> _utf8mb4'')),
  CONSTRAINT `chk_usuarios_nombre` CHECK ((trim(`nombre`) <> _utf8mb4'')),
  CONSTRAINT `chk_usuarios_password` CHECK ((char_length(`password_hash`) >= 60))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `vw_dashboard_campanas`
--

DROP TABLE IF EXISTS `vw_dashboard_campanas`;
/*!50001 DROP VIEW IF EXISTS `vw_dashboard_campanas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_dashboard_campanas` AS SELECT 
 1 AS `campana_id`,
 1 AS `campana`,
 1 AS `activo`,
 1 AS `centros_activos`,
 1 AS `articulos_registrados`,
 1 AS `movimientos_totales`,
 1 AS `transferencias_completadas`,
 1 AS `entregas_pendientes`,
 1 AS `registros_merma`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_dashboard_centros`
--

DROP TABLE IF EXISTS `vw_dashboard_centros`;
/*!50001 DROP VIEW IF EXISTS `vw_dashboard_centros`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_dashboard_centros` AS SELECT 
 1 AS `centro_id`,
 1 AS `centro`,
 1 AS `campanas_activas`,
 1 AS `movimientos_totales`,
 1 AS `recepciones`,
 1 AS `entregas`,
 1 AS `mermas`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_entregas_detalle`
--

DROP TABLE IF EXISTS `vw_entregas_detalle`;
/*!50001 DROP VIEW IF EXISTS `vw_entregas_detalle`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_entregas_detalle` AS SELECT 
 1 AS `entrega_id`,
 1 AS `estado`,
 1 AS `fecha_asignacion`,
 1 AS `fecha_confirmacion`,
 1 AS `movimiento_id`,
 1 AS `campana_id`,
 1 AS `campana`,
 1 AS `centro_id`,
 1 AS `centro`,
 1 AS `articulo_id`,
 1 AS `articulo`,
 1 AS `unidad_medida`,
 1 AS `cantidad`,
 1 AS `institucion_id`,
 1 AS `institucion`,
 1 AS `confirmado_por_usuario_id`,
 1 AS `observaciones_confirmacion`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_historial_movimientos`
--

DROP TABLE IF EXISTS `vw_historial_movimientos`;
/*!50001 DROP VIEW IF EXISTS `vw_historial_movimientos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_historial_movimientos` AS SELECT 
 1 AS `id`,
 1 AS `fecha_movimiento`,
 1 AS `tipo`,
 1 AS `cantidad`,
 1 AS `campana_id`,
 1 AS `campana`,
 1 AS `centro_id`,
 1 AS `centro`,
 1 AS `articulo_id`,
 1 AS `articulo`,
 1 AS `categoria`,
 1 AS `unidad_medida`,
 1 AS `usuario_id`,
 1 AS `registrado_por`,
 1 AS `donante_id`,
 1 AS `donante`,
 1 AS `institucion_id`,
 1 AS `institucion_receptora`,
 1 AS `transferencia_id`,
 1 AS `motivo`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_inventario_actual`
--

DROP TABLE IF EXISTS `vw_inventario_actual`;
/*!50001 DROP VIEW IF EXISTS `vw_inventario_actual`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_inventario_actual` AS SELECT 
 1 AS `campana_id`,
 1 AS `campana`,
 1 AS `centro_id`,
 1 AS `centro`,
 1 AS `articulo_id`,
 1 AS `articulo`,
 1 AS `categoria`,
 1 AS `unidad_medida`,
 1 AS `stock`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'centros_acopio'
--

--
-- Dumping routines for database 'centros_acopio'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_asignar_centro_campana` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_asignar_centro_campana`(
    IN p_usuario_id INT UNSIGNED,
    IN p_centro_id INT UNSIGNED,
    IN p_campana_id INT UNSIGNED
)
BEGIN
    DECLARE v_autorizado INT DEFAULT 0;

    SELECT COUNT(*)
    INTO v_autorizado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = p_usuario_id
      AND u.activo = 1
      AND r.nombre = 'coordinador';

    IF v_autorizado = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Solo el coordinador puede asignar centros';
    END IF;

    INSERT INTO centros_campanas (
        centro_id, campana_id
    )
    VALUES (
        p_centro_id, p_campana_id
    );

    SELECT
        p_centro_id AS centro_id,
        p_campana_id AS campana_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_confirmar_entrega` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_confirmar_entrega`(
    IN p_usuario_id INT UNSIGNED,
    IN p_entrega_id BIGINT UNSIGNED,
    IN p_observaciones VARCHAR(500)
)
BEGIN
    DECLARE v_rol VARCHAR(50);
    DECLARE v_usuario_institucion INT UNSIGNED;
    DECLARE v_usuario_activo BOOLEAN;

    DECLARE v_estado VARCHAR(25);
    DECLARE v_entrega_institucion INT UNSIGNED;

    DECLARE v_existe INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SELECT COUNT(*)
    INTO v_existe
    FROM usuarios
    WHERE id = p_usuario_id;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    SELECT
        r.nombre,
        u.institucion_id,
        u.activo
    INTO
        v_rol,
        v_usuario_institucion,
        v_usuario_activo
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = p_usuario_id;

    IF v_usuario_activo <> 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario inactivo';
    END IF;

    IF v_rol <> 'institucion' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Solo una institucion puede confirmar entregas';
    END IF;

    IF v_usuario_institucion IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no tiene institucion asignada';
    END IF;

    START TRANSACTION;

    SELECT COUNT(*)
    INTO v_existe
    FROM entregas
    WHERE id = p_entrega_id;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Entrega no encontrada';
    END IF;

    SELECT
        e.estado,
        m.institucion_id
    INTO
        v_estado,
        v_entrega_institucion
    FROM entregas e
    JOIN movimientos m
        ON m.id = e.movimiento_id
    WHERE e.id = p_entrega_id
    FOR UPDATE;

    IF v_entrega_institucion <> v_usuario_institucion THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La entrega no pertenece a esta institucion';
    END IF;

    IF v_estado <> 'pendiente' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La entrega ya fue confirmada';
    END IF;

    UPDATE entregas
    SET
        estado = 'confirmada',
        fecha_confirmacion = NOW(),
        confirmado_por_usuario_id = p_usuario_id,
        observaciones_confirmacion = NULLIF(TRIM(p_observaciones), '')
    WHERE id = p_entrega_id;

    COMMIT;

    SELECT
        p_entrega_id AS entrega_id,
        'confirmada' AS estado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_crear_articulo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_articulo`(
    IN p_usuario_id INT UNSIGNED,
    IN p_nombre VARCHAR(120),
    IN p_categoria VARCHAR(80),
    IN p_unidad_medida VARCHAR(40)
)
BEGIN
    DECLARE v_autorizado INT DEFAULT 0;

    SELECT COUNT(*)
    INTO v_autorizado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = p_usuario_id
      AND u.activo = 1
      AND r.nombre = 'coordinador';

    IF v_autorizado = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Solo el coordinador puede crear articulos';
    END IF;

    INSERT INTO articulos (
        nombre, categoria, unidad_medida
    )
    VALUES (
        TRIM(p_nombre),
        TRIM(p_categoria),
        TRIM(p_unidad_medida)
    );

    SELECT LAST_INSERT_ID() AS articulo_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_crear_campana` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_campana`(
    IN p_usuario_id INT UNSIGNED,
    IN p_nombre VARCHAR(120),
    IN p_descripcion TEXT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    DECLARE v_autorizado INT DEFAULT 0;

    SELECT COUNT(*)
    INTO v_autorizado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = p_usuario_id
      AND u.activo = 1
      AND r.nombre = 'coordinador';

    IF v_autorizado = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Solo el coordinador puede crear campanas';
    END IF;

    IF p_fecha_fin < p_fecha_inicio THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Las fechas de la campana son invalidas';
    END IF;

    INSERT INTO campanas (
        nombre, descripcion, fecha_inicio, fecha_fin
    )
    VALUES (
        TRIM(p_nombre),
        p_descripcion,
        p_fecha_inicio,
        p_fecha_fin
    );

    SELECT LAST_INSERT_ID() AS campana_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_crear_centro` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_centro`(
    IN p_usuario_id INT UNSIGNED,
    IN p_nombre VARCHAR(120),
    IN p_institucion VARCHAR(120),
    IN p_direccion VARCHAR(200),
    IN p_ciudad VARCHAR(100),
    IN p_estado VARCHAR(100)
)
BEGIN
    DECLARE v_autorizado INT DEFAULT 0;

    SELECT COUNT(*)
    INTO v_autorizado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = p_usuario_id
      AND u.activo = 1
      AND r.nombre = 'coordinador';

    IF v_autorizado = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Solo el coordinador puede crear centros';
    END IF;

    INSERT INTO centros (
        nombre, institucion, direccion, ciudad, estado
    )
    VALUES (
        TRIM(p_nombre),
        TRIM(p_institucion),
        TRIM(p_direccion),
        TRIM(p_ciudad),
        TRIM(p_estado)
    );

    SELECT LAST_INSERT_ID() AS centro_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_crear_donante` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_donante`(
    IN p_nombre VARCHAR(120),
    IN p_telefono VARCHAR(25)
)
BEGIN
    IF
        (p_nombre IS NULL OR TRIM(p_nombre) = '')
        AND
        (p_telefono IS NULL OR TRIM(p_telefono) = '')
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Debe proporcionarse nombre o telefono';
    END IF;

    INSERT INTO donantes (
        nombre,
        telefono
    )
    VALUES (
        NULLIF(TRIM(p_nombre), ''),
        NULLIF(TRIM(p_telefono), '')
    );

    SELECT LAST_INSERT_ID() AS donante_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_crear_institucion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_institucion`(
    IN p_usuario_id INT UNSIGNED,
    IN p_nombre VARCHAR(150),
    IN p_contacto_nombre VARCHAR(120),
    IN p_correo VARCHAR(150),
    IN p_telefono VARCHAR(25),
    IN p_direccion VARCHAR(200),
    IN p_ciudad VARCHAR(100),
    IN p_estado VARCHAR(100)
)
BEGIN
    DECLARE v_autorizado INT DEFAULT 0;

    SELECT COUNT(*)
    INTO v_autorizado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = p_usuario_id
      AND u.activo = 1
      AND r.nombre = 'coordinador';

    IF v_autorizado = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Solo el coordinador puede crear instituciones';
    END IF;

    INSERT INTO instituciones_receptoras (
        nombre,
        contacto_nombre,
        correo,
        telefono,
        direccion,
        ciudad,
        estado
    )
    VALUES (
        TRIM(p_nombre),
        TRIM(p_contacto_nombre),
        LOWER(TRIM(p_correo)),
        NULLIF(TRIM(p_telefono), ''),
        TRIM(p_direccion),
        TRIM(p_ciudad),
        TRIM(p_estado)
    );

    SELECT LAST_INSERT_ID() AS institucion_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_crear_usuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_usuario`(
    IN p_usuario_creador_id INT UNSIGNED,
    IN p_nombre VARCHAR(120),
    IN p_correo VARCHAR(150),
    IN p_password_hash VARCHAR(255),
    IN p_rol_nombre VARCHAR(50),
    IN p_centro_id INT UNSIGNED,
    IN p_institucion_id INT UNSIGNED
)
BEGIN
    DECLARE v_es_coordinador INT DEFAULT 0;
    DECLARE v_rol_id TINYINT UNSIGNED DEFAULT NULL;

    SELECT COUNT(*)
    INTO v_es_coordinador
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = p_usuario_creador_id
      AND u.activo = 1
      AND r.nombre = 'coordinador';

    IF v_es_coordinador = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Solo el coordinador puede crear usuarios';
    END IF;

    IF p_nombre IS NULL OR TRIM(p_nombre) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre es obligatorio';
    END IF;

    IF p_correo IS NULL OR TRIM(p_correo) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El correo es obligatorio';
    END IF;

    IF p_password_hash IS NULL
       OR CHAR_LENGTH(p_password_hash) < 60 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Hash de contrasena invalido';
    END IF;

    SELECT id
    INTO v_rol_id
    FROM roles
    WHERE nombre = p_rol_nombre
      AND activo = 1
    LIMIT 1;

    IF v_rol_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Rol invalido';
    END IF;

    IF p_rol_nombre IN ('encargado', 'voluntario')
       AND p_centro_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Este rol requiere un centro';
    END IF;

    IF p_rol_nombre = 'institucion'
       AND p_institucion_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario de institucion requiere una institucion';
    END IF;

    IF p_rol_nombre = 'coordinador'
       AND (
           p_centro_id IS NOT NULL
           OR p_institucion_id IS NOT NULL
       )
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El coordinador no debe estar ligado a centro o institucion';
    END IF;

    INSERT INTO usuarios (
        nombre,
        correo,
        password_hash,
        rol_id,
        centro_id,
        institucion_id
    )
    VALUES (
        TRIM(p_nombre),
        LOWER(TRIM(p_correo)),
        p_password_hash,
        v_rol_id,
        p_centro_id,
        p_institucion_id
    );

    SELECT LAST_INSERT_ID() AS usuario_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obtener_usuario_login` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_usuario_login`(
    IN p_correo VARCHAR(150)
)
BEGIN
    SELECT
        u.id,
        u.nombre,
        u.correo,
        u.password_hash,
        u.activo,
        u.intentos_fallidos,
        u.bloqueado_hasta,
        u.centro_id,
        u.institucion_id,
        r.nombre AS rol
    FROM usuarios u
    JOIN roles r
        ON r.id = u.rol_id
    WHERE u.correo = LOWER(TRIM(p_correo))
    LIMIT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_realizar_transferencia` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_realizar_transferencia`(
    IN p_usuario_id INT UNSIGNED,
    IN p_campana_id INT UNSIGNED,
    IN p_centro_origen_id INT UNSIGNED,
    IN p_centro_destino_id INT UNSIGNED,
    IN p_articulo_id INT UNSIGNED,
    IN p_cantidad DECIMAL(15,3),
    IN p_motivo VARCHAR(255)
)
BEGIN
    DECLARE v_rol VARCHAR(50);
    DECLARE v_usuario_centro INT UNSIGNED;
    DECLARE v_activo BOOLEAN;
    DECLARE v_existe INT DEFAULT 0;

    DECLARE v_stock DECIMAL(15,3) DEFAULT 0;
    DECLARE v_transferencia_id BIGINT UNSIGNED;

    DECLARE v_lock_origen VARCHAR(64);
    DECLARE v_lock_destino VARCHAR(64);
    DECLARE v_lock_1 VARCHAR(64);
    DECLARE v_lock_2 VARCHAR(64);

    DECLARE v_lock_1_ok INT DEFAULT 0;
    DECLARE v_lock_2_ok INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;

        IF v_lock_2_ok = 1 THEN
            DO RELEASE_LOCK(v_lock_2);
        END IF;

        IF v_lock_1_ok = 1 THEN
            DO RELEASE_LOCK(v_lock_1);
        END IF;

        RESIGNAL;
    END;

    IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cantidad debe ser mayor a cero';
    END IF;

    IF p_centro_origen_id = p_centro_destino_id THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El centro origen y destino no pueden ser iguales';
    END IF;

    SELECT COUNT(*)
    INTO v_existe
    FROM usuarios
    WHERE id = p_usuario_id;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    SELECT r.nombre, u.centro_id, u.activo
    INTO v_rol, v_usuario_centro, v_activo
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = p_usuario_id;

    IF v_activo <> 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario inactivo';
    END IF;

    IF v_rol NOT IN ('coordinador', 'encargado') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no puede realizar transferencias';
    END IF;

    IF v_rol = 'encargado'
       AND (
           v_usuario_centro IS NULL
           OR v_usuario_centro <> p_centro_origen_id
       )
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El encargado no pertenece al centro de origen';
    END IF;

    SELECT COUNT(*)
    INTO v_existe
    FROM centros_campanas cc
    JOIN centros c ON c.id = cc.centro_id
    JOIN campanas ca ON ca.id = cc.campana_id
    WHERE cc.centro_id = p_centro_origen_id
      AND cc.campana_id = p_campana_id
      AND cc.activo = 1
      AND c.activo = 1
      AND ca.activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Centro origen o campana invalidos';
    END IF;

    SELECT COUNT(*)
    INTO v_existe
    FROM centros_campanas cc
    JOIN centros c ON c.id = cc.centro_id
    WHERE cc.centro_id = p_centro_destino_id
      AND cc.campana_id = p_campana_id
      AND cc.activo = 1
      AND c.activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Centro destino invalido para la campana';
    END IF;

    SELECT COUNT(*)
    INTO v_existe
    FROM articulos
    WHERE id = p_articulo_id
      AND activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Articulo inexistente o inactivo';
    END IF;

    SET v_lock_origen = CONCAT(
        'stock:',
        p_campana_id, ':',
        p_centro_origen_id, ':',
        p_articulo_id
    );

    SET v_lock_destino = CONCAT(
        'stock:',
        p_campana_id, ':',
        p_centro_destino_id, ':',
        p_articulo_id
    );

    IF v_lock_origen < v_lock_destino THEN
        SET v_lock_1 = v_lock_origen;
        SET v_lock_2 = v_lock_destino;
    ELSE
        SET v_lock_1 = v_lock_destino;
        SET v_lock_2 = v_lock_origen;
    END IF;

    SELECT GET_LOCK(v_lock_1, 5)
    INTO v_lock_1_ok;

    IF COALESCE(v_lock_1_ok, 0) <> 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No fue posible bloquear el inventario origen';
    END IF;

    SELECT GET_LOCK(v_lock_2, 5)
    INTO v_lock_2_ok;

    IF COALESCE(v_lock_2_ok, 0) <> 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No fue posible bloquear el inventario destino';
    END IF;

    START TRANSACTION;

    SELECT COALESCE(
        SUM(
            CASE
                WHEN tipo IN (
                    'recepcion',
                    'transferencia_entrada',
                    'ajuste_positivo'
                )
                THEN cantidad
                ELSE -cantidad
            END
        ), 0
    )
    INTO v_stock
    FROM movimientos
    WHERE campana_id = p_campana_id
      AND centro_id = p_centro_origen_id
      AND articulo_id = p_articulo_id;

    IF v_stock < p_cantidad THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente para realizar la transferencia';
    END IF;

    INSERT INTO transferencias (
        campana_id,
        centro_origen_id,
        centro_destino_id,
        usuario_id,
        estado,
        motivo
    )
    VALUES (
        p_campana_id,
        p_centro_origen_id,
        p_centro_destino_id,
        p_usuario_id,
        'pendiente',
        p_motivo
    );

    SET v_transferencia_id = LAST_INSERT_ID();

    INSERT INTO movimientos (
        campana_id,
        centro_id,
        articulo_id,
        usuario_id,
        tipo,
        cantidad,
        transferencia_id,
        motivo
    )
    VALUES (
        p_campana_id,
        p_centro_origen_id,
        p_articulo_id,
        p_usuario_id,
        'transferencia_salida',
        p_cantidad,
        v_transferencia_id,
        p_motivo
    );

    INSERT INTO movimientos (
        campana_id,
        centro_id,
        articulo_id,
        usuario_id,
        tipo,
        cantidad,
        transferencia_id,
        motivo
    )
    VALUES (
        p_campana_id,
        p_centro_destino_id,
        p_articulo_id,
        p_usuario_id,
        'transferencia_entrada',
        p_cantidad,
        v_transferencia_id,
        p_motivo
    );

    UPDATE transferencias
    SET estado = 'completada'
    WHERE id = v_transferencia_id;

    COMMIT;

    DO RELEASE_LOCK(v_lock_2);
    SET v_lock_2_ok = 0;

    DO RELEASE_LOCK(v_lock_1);
    SET v_lock_1_ok = 0;

    SELECT
        v_transferencia_id AS transferencia_id,
        v_stock AS stock_origen_anterior,
        v_stock - p_cantidad AS stock_origen_nuevo;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_registrar_ajuste` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_ajuste`(
    IN p_usuario_id INT UNSIGNED,
    IN p_campana_id INT UNSIGNED,
    IN p_centro_id INT UNSIGNED,
    IN p_articulo_id INT UNSIGNED,
    IN p_tipo VARCHAR(10),
    IN p_cantidad DECIMAL(15,3),
    IN p_motivo VARCHAR(500)
)
BEGIN
    DECLARE v_rol VARCHAR(50);
    DECLARE v_usuario_centro INT UNSIGNED;
    DECLARE v_activo BOOLEAN;
    DECLARE v_existe INT DEFAULT 0;
    DECLARE v_stock DECIMAL(15,3) DEFAULT 0;
    DECLARE v_tipo_movimiento VARCHAR(30);

    DECLARE v_lock VARCHAR(64);
    DECLARE v_lock_ok INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;

        IF v_lock_ok = 1 THEN
            DO RELEASE_LOCK(v_lock);
        END IF;

        RESIGNAL;
    END;

    IF p_tipo NOT IN ('positivo', 'negativo') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Tipo de ajuste invalido';
    END IF;

    IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cantidad debe ser mayor a cero';
    END IF;

    IF p_motivo IS NULL OR TRIM(p_motivo) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El ajuste requiere un motivo';
    END IF;

    SELECT COUNT(*)
    INTO v_existe
    FROM usuarios
    WHERE id = p_usuario_id;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    SELECT r.nombre, u.centro_id, u.activo
    INTO v_rol, v_usuario_centro, v_activo
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = p_usuario_id;

    IF v_activo <> 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario inactivo';
    END IF;

    IF v_rol NOT IN ('coordinador', 'encargado') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no puede registrar ajustes';
    END IF;

    IF v_rol = 'encargado'
       AND (v_usuario_centro IS NULL OR v_usuario_centro <> p_centro_id)
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El encargado no pertenece al centro indicado';
    END IF;

    SELECT COUNT(*)
    INTO v_existe
    FROM centros_campanas cc
    JOIN centros c ON c.id = cc.centro_id
    JOIN campanas ca ON ca.id = cc.campana_id
    WHERE cc.centro_id = p_centro_id
      AND cc.campana_id = p_campana_id
      AND cc.activo = 1
      AND c.activo = 1
      AND ca.activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Centro o campana no validos';
    END IF;

    SELECT COUNT(*)
    INTO v_existe
    FROM articulos
    WHERE id = p_articulo_id
      AND activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Articulo inexistente o inactivo';
    END IF;

    SET v_lock = CONCAT(
        'stock:',
        p_campana_id, ':',
        p_centro_id, ':',
        p_articulo_id
    );

    SELECT GET_LOCK(v_lock, 5)
    INTO v_lock_ok;

    IF COALESCE(v_lock_ok, 0) <> 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No fue posible bloquear el inventario';
    END IF;

    START TRANSACTION;

    SELECT COALESCE(
        SUM(
            CASE
                WHEN tipo IN (
                    'recepcion',
                    'transferencia_entrada',
                    'ajuste_positivo'
                )
                THEN cantidad
                ELSE -cantidad
            END
        ), 0
    )
    INTO v_stock
    FROM movimientos
    WHERE campana_id = p_campana_id
      AND centro_id = p_centro_id
      AND articulo_id = p_articulo_id;

    IF p_tipo = 'negativo' AND v_stock < p_cantidad THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente para realizar el ajuste';
    END IF;

    IF p_tipo = 'positivo' THEN
        SET v_tipo_movimiento = 'ajuste_positivo';
    ELSE
        SET v_tipo_movimiento = 'ajuste_negativo';
    END IF;

    INSERT INTO movimientos (
        campana_id,
        centro_id,
        articulo_id,
        usuario_id,
        tipo,
        cantidad,
        motivo
    )
    VALUES (
        p_campana_id,
        p_centro_id,
        p_articulo_id,
        p_usuario_id,
        v_tipo_movimiento,
        p_cantidad,
        TRIM(p_motivo)
    );

    COMMIT;

    DO RELEASE_LOCK(v_lock);
    SET v_lock_ok = 0;

    SELECT
        LAST_INSERT_ID() AS movimiento_id,
        v_stock AS stock_anterior,
        CASE
            WHEN p_tipo = 'positivo'
                THEN v_stock + p_cantidad
            ELSE v_stock - p_cantidad
        END AS stock_nuevo;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_registrar_entrega` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_entrega`(
    IN p_usuario_id INT UNSIGNED,
    IN p_campana_id INT UNSIGNED,
    IN p_centro_id INT UNSIGNED,
    IN p_articulo_id INT UNSIGNED,
    IN p_institucion_id INT UNSIGNED,
    IN p_cantidad DECIMAL(15,3),
    IN p_motivo VARCHAR(500)
)
BEGIN
    DECLARE v_rol VARCHAR(50) DEFAULT NULL;
    DECLARE v_usuario_centro INT UNSIGNED DEFAULT NULL;
    DECLARE v_usuario_activo BOOLEAN DEFAULT NULL;

    DECLARE v_existe INT DEFAULT 0;
    DECLARE v_stock DECIMAL(15,3) DEFAULT 0;

    DECLARE v_lock_nombre VARCHAR(64);
    DECLARE v_lock_obtenido INT DEFAULT 0;

    DECLARE v_movimiento_id BIGINT UNSIGNED;
    DECLARE v_entrega_id BIGINT UNSIGNED;

    -- Si ocurre cualquier error:
    -- cancelar cambios y liberar el bloqueo.
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;

        IF v_lock_obtenido = 1 THEN
            DO RELEASE_LOCK(v_lock_nombre);
        END IF;

        RESIGNAL;
    END;

    -- 1. Validar cantidad
    IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cantidad debe ser mayor a cero';
    END IF;

    -- 2. Verificar que el usuario exista
    SELECT COUNT(*)
    INTO v_existe
    FROM usuarios
    WHERE id = p_usuario_id;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    -- 3. Obtener datos del usuario
    SELECT
        r.nombre,
        u.centro_id,
        u.activo
    INTO
        v_rol,
        v_usuario_centro,
        v_usuario_activo
    FROM usuarios u
    INNER JOIN roles r
        ON r.id = u.rol_id
    WHERE u.id = p_usuario_id;

    IF v_usuario_activo <> 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario esta inactivo';
    END IF;

    -- 4. Validar rol
    IF v_rol NOT IN ('coordinador', 'encargado', 'voluntario') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no tiene permiso para registrar entregas';
    END IF;

    -- 5. Encargado y voluntario solo operan en su centro
    IF v_rol IN ('encargado', 'voluntario')
       AND (
           v_usuario_centro IS NULL
           OR v_usuario_centro <> p_centro_id
       )
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no pertenece al centro indicado';
    END IF;

    -- 6. Validar centro activo
    SELECT COUNT(*)
    INTO v_existe
    FROM centros
    WHERE id = p_centro_id
      AND activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Centro inexistente o inactivo';
    END IF;

    -- 7. Validar campaña activa
    SELECT COUNT(*)
    INTO v_existe
    FROM campanas
    WHERE id = p_campana_id
      AND activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Campana inexistente o inactiva';
    END IF;

    -- 8. Validar participación del centro en la campaña
    SELECT COUNT(*)
    INTO v_existe
    FROM centros_campanas
    WHERE centro_id = p_centro_id
      AND campana_id = p_campana_id
      AND activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El centro no participa activamente en esta campana';
    END IF;

    -- 9. Validar artículo activo
    SELECT COUNT(*)
    INTO v_existe
    FROM articulos
    WHERE id = p_articulo_id
      AND activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Articulo inexistente o inactivo';
    END IF;

    -- 10. Validar institución receptora
    SELECT COUNT(*)
    INTO v_existe
    FROM instituciones_receptoras
    WHERE id = p_institucion_id
      AND activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Institucion inexistente o inactiva';
    END IF;

    /*
       11. Crear un bloqueo exclusivo para:
       campaña + centro + artículo
    */

    SET v_lock_nombre = CONCAT(
        'stock:',
        p_campana_id, ':',
        p_centro_id, ':',
        p_articulo_id
    );

    SELECT GET_LOCK(v_lock_nombre, 5)
    INTO v_lock_obtenido;

    IF COALESCE(v_lock_obtenido, 0) <> 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No fue posible bloquear temporalmente el inventario';
    END IF;

    START TRANSACTION;

    -- 12. Calcular stock actual
    SELECT
        COALESCE(
            SUM(
                CASE
                    WHEN tipo IN (
                        'recepcion',
                        'transferencia_entrada',
                        'ajuste_positivo'
                    )
                    THEN cantidad

                    WHEN tipo IN (
                        'entrega',
                        'merma',
                        'transferencia_salida',
                        'ajuste_negativo'
                    )
                    THEN -cantidad

                    ELSE 0
                END
            ),
            0
        )
    INTO v_stock
    FROM movimientos
    WHERE campana_id = p_campana_id
      AND centro_id = p_centro_id
      AND articulo_id = p_articulo_id;

    -- 13. Impedir stock negativo
    IF v_stock < p_cantidad THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente para realizar la entrega';
    END IF;

    -- 14. Crear movimiento de salida
    INSERT INTO movimientos (
        campana_id,
        centro_id,
        articulo_id,
        usuario_id,
        tipo,
        cantidad,
        institucion_id,
        motivo
    )
    VALUES (
        p_campana_id,
        p_centro_id,
        p_articulo_id,
        p_usuario_id,
        'entrega',
        p_cantidad,
        p_institucion_id,
        p_motivo
    );

    SET v_movimiento_id = LAST_INSERT_ID();

    -- 15. Crear entrega pendiente de confirmación
    INSERT INTO entregas (
        movimiento_id
    )
    VALUES (
        v_movimiento_id
    );

    SET v_entrega_id = LAST_INSERT_ID();

    COMMIT;

    DO RELEASE_LOCK(v_lock_nombre);
    SET v_lock_obtenido = 0;

    -- 16. Devolver resultado
    SELECT
        v_entrega_id AS entrega_id,
        v_movimiento_id AS movimiento_id,
        v_stock AS stock_anterior,
        v_stock - p_cantidad AS stock_nuevo;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_registrar_merma` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_merma`(
    IN p_usuario_id INT UNSIGNED,
    IN p_campana_id INT UNSIGNED,
    IN p_centro_id INT UNSIGNED,
    IN p_articulo_id INT UNSIGNED,
    IN p_cantidad DECIMAL(15,3),
    IN p_motivo VARCHAR(500)
)
BEGIN
    DECLARE v_rol VARCHAR(50) DEFAULT NULL;
    DECLARE v_usuario_centro INT UNSIGNED DEFAULT NULL;
    DECLARE v_activo BOOLEAN DEFAULT NULL;
    DECLARE v_existe INT DEFAULT 0;
    DECLARE v_stock DECIMAL(15,3) DEFAULT 0;

    DECLARE v_lock VARCHAR(64);
    DECLARE v_lock_ok INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;

        IF v_lock_ok = 1 THEN
            DO RELEASE_LOCK(v_lock);
        END IF;

        RESIGNAL;
    END;

    IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cantidad debe ser mayor a cero';
    END IF;

    IF p_motivo IS NULL OR TRIM(p_motivo) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La merma requiere un motivo';
    END IF;

    SELECT COUNT(*)
    INTO v_existe
    FROM usuarios
    WHERE id = p_usuario_id;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    SELECT r.nombre, u.centro_id, u.activo
    INTO v_rol, v_usuario_centro, v_activo
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = p_usuario_id;

    IF v_activo <> 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario inactivo';
    END IF;

    IF v_rol NOT IN ('coordinador', 'encargado') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no puede registrar mermas';
    END IF;

    IF v_rol = 'encargado'
       AND (v_usuario_centro IS NULL OR v_usuario_centro <> p_centro_id)
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El encargado no pertenece al centro indicado';
    END IF;

    SELECT COUNT(*)
    INTO v_existe
    FROM centros_campanas cc
    JOIN centros c ON c.id = cc.centro_id
    JOIN campanas ca ON ca.id = cc.campana_id
    WHERE cc.centro_id = p_centro_id
      AND cc.campana_id = p_campana_id
      AND cc.activo = 1
      AND c.activo = 1
      AND ca.activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Centro o campana no validos';
    END IF;

    SELECT COUNT(*)
    INTO v_existe
    FROM articulos
    WHERE id = p_articulo_id
      AND activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Articulo inexistente o inactivo';
    END IF;

    SET v_lock = CONCAT(
        'stock:',
        p_campana_id, ':',
        p_centro_id, ':',
        p_articulo_id
    );

    SELECT GET_LOCK(v_lock, 5)
    INTO v_lock_ok;

    IF COALESCE(v_lock_ok, 0) <> 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No fue posible bloquear el inventario';
    END IF;

    START TRANSACTION;

    SELECT COALESCE(
        SUM(
            CASE
                WHEN tipo IN (
                    'recepcion',
                    'transferencia_entrada',
                    'ajuste_positivo'
                ) THEN cantidad

                ELSE -cantidad
            END
        ), 0
    )
    INTO v_stock
    FROM movimientos
    WHERE campana_id = p_campana_id
      AND centro_id = p_centro_id
      AND articulo_id = p_articulo_id;

    IF v_stock < p_cantidad THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente para registrar la merma';
    END IF;

    INSERT INTO movimientos (
        campana_id,
        centro_id,
        articulo_id,
        usuario_id,
        tipo,
        cantidad,
        motivo
    )
    VALUES (
        p_campana_id,
        p_centro_id,
        p_articulo_id,
        p_usuario_id,
        'merma',
        p_cantidad,
        TRIM(p_motivo)
    );

    COMMIT;

    DO RELEASE_LOCK(v_lock);
    SET v_lock_ok = 0;

    SELECT
        LAST_INSERT_ID() AS movimiento_id,
        v_stock AS stock_anterior,
        v_stock - p_cantidad AS stock_nuevo;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_registrar_recepcion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_recepcion`(
    IN p_usuario_id INT UNSIGNED,
    IN p_campana_id INT UNSIGNED,
    IN p_centro_id INT UNSIGNED,
    IN p_articulo_id INT UNSIGNED,
    IN p_cantidad DECIMAL(15,3),
    IN p_donante_id INT UNSIGNED
)
BEGIN
    DECLARE v_rol VARCHAR(50) DEFAULT NULL;
    DECLARE v_usuario_centro INT UNSIGNED DEFAULT NULL;
    DECLARE v_usuario_activo BOOLEAN DEFAULT NULL;
    DECLARE v_existe INT DEFAULT 0;

    -- 1. Validar cantidad
    IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cantidad debe ser mayor a cero';
    END IF;

    -- 2. Obtener usuario, rol y centro asignado
    SELECT
        r.nombre,
        u.centro_id,
        u.activo
    INTO
        v_rol,
        v_usuario_centro,
        v_usuario_activo
    FROM usuarios u
    INNER JOIN roles r
        ON r.id = u.rol_id
    WHERE u.id = p_usuario_id
    LIMIT 1;

    IF v_rol IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    IF v_usuario_activo <> 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario esta inactivo';
    END IF;

    -- 3. Validar rol
    IF v_rol NOT IN ('coordinador', 'encargado', 'voluntario') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no tiene permiso para registrar recepciones';
    END IF;

    -- 4. Encargado y voluntario solo pueden operar en su centro
    IF v_rol IN ('encargado', 'voluntario')
       AND (
           v_usuario_centro IS NULL
           OR v_usuario_centro <> p_centro_id
       )
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no pertenece al centro indicado';
    END IF;

    -- 5. Validar centro activo
    SELECT COUNT(*)
    INTO v_existe
    FROM centros
    WHERE id = p_centro_id
      AND activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Centro inexistente o inactivo';
    END IF;

    -- 6. Validar campaña activa
    SELECT COUNT(*)
    INTO v_existe
    FROM campanas
    WHERE id = p_campana_id
      AND activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Campana inexistente o inactiva';
    END IF;

    -- 7. Validar que el centro participe en la campaña
    SELECT COUNT(*)
    INTO v_existe
    FROM centros_campanas
    WHERE centro_id = p_centro_id
      AND campana_id = p_campana_id
      AND activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El centro no participa activamente en esta campana';
    END IF;

    -- 8. Validar artículo activo
    SELECT COUNT(*)
    INTO v_existe
    FROM articulos
    WHERE id = p_articulo_id
      AND activo = 1;

    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Articulo inexistente o inactivo';
    END IF;

    -- 9. Validar donante si fue proporcionado
    IF p_donante_id IS NOT NULL THEN
        SELECT COUNT(*)
        INTO v_existe
        FROM donantes
        WHERE id = p_donante_id;

        IF v_existe = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Donante inexistente';
        END IF;
    END IF;

    -- 10. Registrar movimiento
    INSERT INTO movimientos (
        campana_id,
        centro_id,
        articulo_id,
        usuario_id,
        tipo,
        cantidad,
        donante_id
    )
    VALUES (
        p_campana_id,
        p_centro_id,
        p_articulo_id,
        p_usuario_id,
        'recepcion',
        p_cantidad,
        p_donante_id
    );

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `vw_dashboard_campanas`
--

/*!50001 DROP VIEW IF EXISTS `vw_dashboard_campanas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_dashboard_campanas` AS select `c`.`id` AS `campana_id`,`c`.`nombre` AS `campana`,`c`.`activo` AS `activo`,(select count(0) from `centros_campanas` `cc` where ((`cc`.`campana_id` = `c`.`id`) and (`cc`.`activo` = 1))) AS `centros_activos`,(select count(distinct `m`.`articulo_id`) from `movimientos` `m` where (`m`.`campana_id` = `c`.`id`)) AS `articulos_registrados`,(select count(0) from `movimientos` `m` where (`m`.`campana_id` = `c`.`id`)) AS `movimientos_totales`,(select count(0) from `transferencias` `t` where ((`t`.`campana_id` = `c`.`id`) and (`t`.`estado` = 'completada'))) AS `transferencias_completadas`,(select count(0) from (`entregas` `e` join `movimientos` `m` on((`m`.`id` = `e`.`movimiento_id`))) where ((`m`.`campana_id` = `c`.`id`) and (`e`.`estado` = 'pendiente'))) AS `entregas_pendientes`,(select count(0) from `movimientos` `m` where ((`m`.`campana_id` = `c`.`id`) and (`m`.`tipo` = 'merma'))) AS `registros_merma` from `campanas` `c` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_dashboard_centros`
--

/*!50001 DROP VIEW IF EXISTS `vw_dashboard_centros`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_dashboard_centros` AS select `c`.`id` AS `centro_id`,`c`.`nombre` AS `centro`,(select count(0) from `centros_campanas` `cc` where ((`cc`.`centro_id` = `c`.`id`) and (`cc`.`activo` = 1))) AS `campanas_activas`,(select count(0) from `movimientos` `m` where (`m`.`centro_id` = `c`.`id`)) AS `movimientos_totales`,(select count(0) from `movimientos` `m` where ((`m`.`centro_id` = `c`.`id`) and (`m`.`tipo` = 'recepcion'))) AS `recepciones`,(select count(0) from `movimientos` `m` where ((`m`.`centro_id` = `c`.`id`) and (`m`.`tipo` = 'entrega'))) AS `entregas`,(select count(0) from `movimientos` `m` where ((`m`.`centro_id` = `c`.`id`) and (`m`.`tipo` = 'merma'))) AS `mermas` from `centros` `c` where (`c`.`activo` = 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_entregas_detalle`
--

/*!50001 DROP VIEW IF EXISTS `vw_entregas_detalle`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_entregas_detalle` AS select `e`.`id` AS `entrega_id`,`e`.`estado` AS `estado`,`e`.`fecha_asignacion` AS `fecha_asignacion`,`e`.`fecha_confirmacion` AS `fecha_confirmacion`,`m`.`id` AS `movimiento_id`,`m`.`campana_id` AS `campana_id`,`ca`.`nombre` AS `campana`,`m`.`centro_id` AS `centro_id`,`ce`.`nombre` AS `centro`,`m`.`articulo_id` AS `articulo_id`,`a`.`nombre` AS `articulo`,`a`.`unidad_medida` AS `unidad_medida`,`m`.`cantidad` AS `cantidad`,`m`.`institucion_id` AS `institucion_id`,`ir`.`nombre` AS `institucion`,`e`.`confirmado_por_usuario_id` AS `confirmado_por_usuario_id`,`e`.`observaciones_confirmacion` AS `observaciones_confirmacion` from (((((`entregas` `e` join `movimientos` `m` on((`m`.`id` = `e`.`movimiento_id`))) join `campanas` `ca` on((`ca`.`id` = `m`.`campana_id`))) join `centros` `ce` on((`ce`.`id` = `m`.`centro_id`))) join `articulos` `a` on((`a`.`id` = `m`.`articulo_id`))) join `instituciones_receptoras` `ir` on((`ir`.`id` = `m`.`institucion_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_historial_movimientos`
--

/*!50001 DROP VIEW IF EXISTS `vw_historial_movimientos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_historial_movimientos` AS select `m`.`id` AS `id`,`m`.`fecha_movimiento` AS `fecha_movimiento`,`m`.`tipo` AS `tipo`,`m`.`cantidad` AS `cantidad`,`m`.`campana_id` AS `campana_id`,`ca`.`nombre` AS `campana`,`m`.`centro_id` AS `centro_id`,`ce`.`nombre` AS `centro`,`m`.`articulo_id` AS `articulo_id`,`a`.`nombre` AS `articulo`,`a`.`categoria` AS `categoria`,`a`.`unidad_medida` AS `unidad_medida`,`m`.`usuario_id` AS `usuario_id`,`u`.`nombre` AS `registrado_por`,`m`.`donante_id` AS `donante_id`,`d`.`nombre` AS `donante`,`m`.`institucion_id` AS `institucion_id`,`ir`.`nombre` AS `institucion_receptora`,`m`.`transferencia_id` AS `transferencia_id`,`m`.`motivo` AS `motivo` from ((((((`movimientos` `m` join `campanas` `ca` on((`ca`.`id` = `m`.`campana_id`))) join `centros` `ce` on((`ce`.`id` = `m`.`centro_id`))) join `articulos` `a` on((`a`.`id` = `m`.`articulo_id`))) join `usuarios` `u` on((`u`.`id` = `m`.`usuario_id`))) left join `donantes` `d` on((`d`.`id` = `m`.`donante_id`))) left join `instituciones_receptoras` `ir` on((`ir`.`id` = `m`.`institucion_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_inventario_actual`
--

/*!50001 DROP VIEW IF EXISTS `vw_inventario_actual`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_inventario_actual` AS select `m`.`campana_id` AS `campana_id`,`c`.`nombre` AS `campana`,`m`.`centro_id` AS `centro_id`,`ce`.`nombre` AS `centro`,`m`.`articulo_id` AS `articulo_id`,`a`.`nombre` AS `articulo`,`a`.`categoria` AS `categoria`,`a`.`unidad_medida` AS `unidad_medida`,sum((case when (`m`.`tipo` in ('recepcion','transferencia_entrada','ajuste_positivo')) then `m`.`cantidad` when (`m`.`tipo` in ('entrega','merma','transferencia_salida','ajuste_negativo')) then -(`m`.`cantidad`) else 0 end)) AS `stock` from (((`movimientos` `m` join `campanas` `c` on((`c`.`id` = `m`.`campana_id`))) join `centros` `ce` on((`ce`.`id` = `m`.`centro_id`))) join `articulos` `a` on((`a`.`id` = `m`.`articulo_id`))) group by `m`.`campana_id`,`c`.`nombre`,`m`.`centro_id`,`ce`.`nombre`,`m`.`articulo_id`,`a`.`nombre`,`a`.`categoria`,`a`.`unidad_medida` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-03 15:14:02
