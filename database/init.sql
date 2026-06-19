-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: businesstravel
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `spese`
--

DROP TABLE IF EXISTS `spese`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `spese` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_trasferta` int(11) NOT NULL,
  `categoria` enum('vitto','alloggio','trasporto','altro') NOT NULL,
  `importo` decimal(10,2) NOT NULL,
  `url_scontrino` varchar(255) DEFAULT NULL,
  `fuori_policy` tinyint(1) DEFAULT 0,
  `creato_il` timestamp NOT NULL DEFAULT current_timestamp(),
  `stato_approvazione` enum('da_valutare','approvata','respinta') DEFAULT 'da_valutare',
  `importo_rimborsato` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_spese_trasferte` (`id_trasferta`),
  CONSTRAINT `fk_spese_trasferte` FOREIGN KEY (`id_trasferta`) REFERENCES `trasferte` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spese`
--

LOCK TABLES `spese` WRITE;
/*!40000 ALTER TABLE `spese` DISABLE KEYS */;
INSERT INTO `spese` VALUES (5,7,'alloggio',6.00,'/uploads/1781705551512-357615494.webp',0,'2026-06-17 14:12:31','approvata',6.00),(9,17,'vitto',60.00,'/uploads/1781876941722-861777513-images.jfif',0,'2026-06-19 13:49:01','da_valutare',NULL);
/*!40000 ALTER TABLE `spese` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trasferte`
--

DROP TABLE IF EXISTS `trasferte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trasferte` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_utente` int(11) NOT NULL,
  `destinazione` varchar(150) NOT NULL,
  `data_inizio` date NOT NULL,
  `data_fine` date NOT NULL,
  `motivo` text NOT NULL,
  `stato` enum('in_attesa','approvata','rifiutata') DEFAULT 'in_attesa',
  `creato_il` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_trasferte_utenti` (`id_utente`),
  CONSTRAINT `fk_trasferte_utenti` FOREIGN KEY (`id_utente`) REFERENCES `utenti` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trasferte`
--

LOCK TABLES `trasferte` WRITE;
/*!40000 ALTER TABLE `trasferte` DISABLE KEYS */;
INSERT INTO `trasferte` VALUES (3,3,'Roma (Workshop Tech)','2026-05-10','2026-05-12','Corso di aggiornamento su React 19 e Next.js App Router.','approvata','2026-06-16 12:45:55'),(4,1,'torino','2026-06-17','2026-06-21','voglio andare in vacanza','approvata','2026-06-16 20:27:30'),(5,1,'Roma','2026-06-25','2026-06-30','voglio andare in vacanza pt2','approvata','2026-06-16 20:44:26'),(7,1,'Roma','2026-06-24','2026-06-30','aaaa','approvata','2026-06-17 08:59:44'),(13,2,'dada','2026-06-25','2026-06-26','adadad','approvata','2026-06-18 09:17:14'),(14,2,'dada','2026-06-27','2026-06-30','adadadad','approvata','2026-06-18 09:58:30'),(15,2,'Dada','2026-08-01','2026-09-03','DADADA','approvata','2026-06-18 09:59:06'),(16,1,'Romaaa','2026-08-14','2026-10-23','lplplplp','approvata','2026-06-18 10:53:25'),(17,2,'Roma','2027-03-03','2027-06-03','aaaa','approvata','2026-06-18 15:25:25');
/*!40000 ALTER TABLE `trasferte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_policies`
--

DROP TABLE IF EXISTS `travel_policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `travel_policies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoria` enum('vitto','alloggio','trasporto','altro') NOT NULL,
  `massimale_giornaliero` decimal(10,2) NOT NULL,
  `aggiornato_il` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `categoria` (`categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_policies`
--

LOCK TABLES `travel_policies` WRITE;
/*!40000 ALTER TABLE `travel_policies` DISABLE KEYS */;
INSERT INTO `travel_policies` VALUES (1,'vitto',60.00,'2026-06-18 07:25:06'),(2,'alloggio',170.00,'2026-06-18 07:25:06'),(3,'trasporto',100.00,'2026-06-15 14:21:06'),(4,'altro',30.00,'2026-06-15 14:21:06');
/*!40000 ALTER TABLE `travel_policies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utenti`
--

DROP TABLE IF EXISTS `utenti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utenti` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `ruolo` enum('user','admin') DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utenti`
--

LOCK TABLES `utenti` WRITE;
/*!40000 ALTER TABLE `utenti` DISABLE KEYS */;
INSERT INTO `utenti` VALUES (1,'Mario Rossi','mario.rossi@azienda.com','$2a$10$uu5sVawVbfIjtOjtUiSNrOe44lrYN1sn3g9m.66KAI715Z3F2yIM.','user'),(2,'Sara Bianchi','sara.bianchi@azienda.com','$2a$10$uu5sVawVbfIjtOjtUiSNrOe44lrYN1sn3g9m.66KAI715Z3F2yIM.','admin'),(3,'Luca Verdi','luca.verdi@azienda.com','$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa','user'),(6,'kev kev','kevkev@azienda.com','$2a$10$/pBC8OQ5t6t5iZkZMzAuq.KTTAfkBNPaB2dd4g79R8gSxOalnlkpO','user');
/*!40000 ALTER TABLE `utenti` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-19 17:26:50
