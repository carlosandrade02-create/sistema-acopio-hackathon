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
-- Dumping data for table `articulos`
--

LOCK TABLES `articulos` WRITE;
/*!40000 ALTER TABLE `articulos` DISABLE KEYS */;
INSERT INTO `articulos` VALUES (4,'Agua','Bebidas','caja',1,'2026-09-03 21:07:41','2026-09-03 21:07:41'),(5,'Arroz','Alimentos','kg',1,'2026-09-03 21:07:41','2026-09-03 21:07:41'),(6,'Cobijas','Abrigo','pieza',1,'2026-09-03 21:07:42','2026-09-03 21:07:42');
/*!40000 ALTER TABLE `articulos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `campanas`
--

LOCK TABLES `campanas` WRITE;
/*!40000 ALTER TABLE `campanas` DISABLE KEYS */;
INSERT INTO `campanas` VALUES (4,'Apoyo Huracan 2026','Recoleccion de viveres para familias afectadas','2026-09-01','2026-10-15',1,'2026-09-03 21:06:44','2026-09-03 21:06:44');
/*!40000 ALTER TABLE `campanas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `centros`
--

LOCK TABLES `centros` WRITE;
/*!40000 ALTER TABLE `centros` DISABLE KEYS */;
INSERT INTO `centros` VALUES (6,'Centro Anahuac Cancun','Universidad Anahuac Cancun','Av. Colosio','Cancun','Quintana Roo',1,'2026-09-03 21:06:35','2026-09-03 21:06:35'),(7,'Centro Comunitario Norte','Municipio de Benito Juarez','Zona Norte','Cancun','Quintana Roo',1,'2026-09-03 21:06:39','2026-09-03 21:06:39');
/*!40000 ALTER TABLE `centros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `centros_campanas`
--

LOCK TABLES `centros_campanas` WRITE;
/*!40000 ALTER TABLE `centros_campanas` DISABLE KEYS */;
INSERT INTO `centros_campanas` VALUES (6,4,1,'2026-09-03 21:06:50'),(7,4,1,'2026-09-03 21:06:51');
/*!40000 ALTER TABLE `centros_campanas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `donantes`
--

LOCK TABLES `donantes` WRITE;
/*!40000 ALTER TABLE `donantes` DISABLE KEYS */;
INSERT INTO `donantes` VALUES (1,'Carlos Mendoza','9981234567','2026-09-03 21:08:30');
/*!40000 ALTER TABLE `donantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `entregas`
--

LOCK TABLES `entregas` WRITE;
/*!40000 ALTER TABLE `entregas` DISABLE KEYS */;
INSERT INTO `entregas` VALUES (2,16,'pendiente','2026-09-03 21:09:14',NULL,NULL,NULL);
/*!40000 ALTER TABLE `entregas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `instituciones_receptoras`
--

LOCK TABLES `instituciones_receptoras` WRITE;
/*!40000 ALTER TABLE `instituciones_receptoras` DISABLE KEYS */;
INSERT INTO `instituciones_receptoras` VALUES (3,'Refugio Temporal Cancun','Responsable del Refugio','refugio@acopio.local','9980000000','Zona de Refugios','Cancun','Quintana Roo',1,'2026-09-03 21:07:54','2026-09-03 21:07:54');
/*!40000 ALTER TABLE `instituciones_receptoras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `movimientos`
--

LOCK TABLES `movimientos` WRITE;
/*!40000 ALTER TABLE `movimientos` DISABLE KEYS */;
INSERT INTO `movimientos` VALUES (10,4,6,4,7,'recepcion',100.000,1,NULL,NULL,NULL,'2026-09-03 21:08:40'),(11,4,6,5,7,'recepcion',80.000,NULL,NULL,NULL,NULL,'2026-09-03 21:08:47'),(12,4,6,6,7,'recepcion',30.000,NULL,NULL,NULL,NULL,'2026-09-03 21:08:51'),(13,4,7,4,8,'recepcion',40.000,NULL,NULL,NULL,NULL,'2026-09-03 21:09:02'),(14,4,6,4,6,'transferencia_salida',20.000,NULL,NULL,2,'Redistribucion por demanda del Centro Norte','2026-09-03 21:09:07'),(15,4,7,4,6,'transferencia_entrada',20.000,NULL,NULL,2,'Redistribucion por demanda del Centro Norte','2026-09-03 21:09:07'),(16,4,6,4,7,'entrega',15.000,NULL,3,NULL,'Entrega al refugio temporal','2026-09-03 21:09:14'),(17,4,6,5,6,'merma',5.000,NULL,NULL,NULL,'Producto danado durante almacenamiento','2026-09-03 21:09:20'),(18,4,6,6,6,'ajuste_positivo',2.000,NULL,NULL,NULL,'Correccion despues de conteo fisico','2026-09-03 21:09:27');
/*!40000 ALTER TABLE `movimientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'coordinador','Coordinador general del sistema',1),(2,'encargado','Encargado de un centro de acopio',1),(3,'voluntario','Voluntario asignado a un centro de acopio',1),(4,'institucion','Usuario de una institucion receptora',1);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `transferencias`
--

LOCK TABLES `transferencias` WRITE;
/*!40000 ALTER TABLE `transferencias` DISABLE KEYS */;
INSERT INTO `transferencias` VALUES (2,4,6,7,6,'completada','Redistribucion por demanda del Centro Norte','2026-09-03 21:09:07','2026-09-03 21:09:07');
/*!40000 ALTER TABLE `transferencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (5,'Coordinador General','coordinador@acopio.local','XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',1,NULL,NULL,1,0,NULL,NULL,'2026-09-03 21:03:03','2026-09-03 21:03:03'),(6,'Encargado Anahuac','encargado@acopio.local','XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',2,6,NULL,1,0,NULL,NULL,'2026-09-03 21:08:04','2026-09-03 21:08:04'),(7,'Voluntario Anahuac','voluntario@acopio.local','XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',3,6,NULL,1,0,NULL,NULL,'2026-09-03 21:08:10','2026-09-03 21:08:10'),(8,'Encargado Centro Norte','encargado.norte@acopio.local','XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',2,7,NULL,1,0,NULL,NULL,'2026-09-03 21:08:15','2026-09-03 21:08:15'),(9,'Usuario Refugio','usuario.refugio@acopio.local','XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',4,NULL,3,1,0,NULL,NULL,'2026-09-03 21:08:19','2026-09-03 21:08:19');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-03 15:14:26
