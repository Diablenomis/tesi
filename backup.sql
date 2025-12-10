-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: localhost    Database: gym_db
-- ------------------------------------------------------
-- Server version	8.0.31

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
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add coach',1,'add_coach'),(2,'Can change coach',1,'change_coach'),(3,'Can delete coach',1,'delete_coach'),(4,'Can view coach',1,'view_coach'),(5,'Can add log entry',2,'add_logentry'),(6,'Can change log entry',2,'change_logentry'),(7,'Can delete log entry',2,'delete_logentry'),(8,'Can view log entry',2,'view_logentry'),(9,'Can add permission',3,'add_permission'),(10,'Can change permission',3,'change_permission'),(11,'Can delete permission',3,'delete_permission'),(12,'Can view permission',3,'view_permission'),(13,'Can add group',4,'add_group'),(14,'Can change group',4,'change_group'),(15,'Can delete group',4,'delete_group'),(16,'Can view group',4,'view_group'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add user',7,'add_user'),(26,'Can change user',7,'change_user'),(27,'Can delete user',7,'delete_user'),(28,'Can view user',7,'view_user'),(29,'Can add cron job log',8,'add_cronjoblog'),(30,'Can change cron job log',8,'change_cronjoblog'),(31,'Can delete cron job log',8,'delete_cronjoblog'),(32,'Can view cron job log',8,'view_cronjoblog'),(33,'Can add cron job lock',9,'add_cronjoblock'),(34,'Can change cron job lock',9,'change_cronjoblock'),(35,'Can delete cron job lock',9,'delete_cronjoblock'),(36,'Can view cron job lock',9,'view_cronjoblock'),(37,'Can add blacklisted token',10,'add_blacklistedtoken'),(38,'Can change blacklisted token',10,'change_blacklistedtoken'),(39,'Can delete blacklisted token',10,'delete_blacklistedtoken'),(40,'Can view blacklisted token',10,'view_blacklistedtoken'),(41,'Can add outstanding token',11,'add_outstandingtoken'),(42,'Can change outstanding token',11,'change_outstandingtoken'),(43,'Can delete outstanding token',11,'delete_outstandingtoken'),(44,'Can view outstanding token',11,'view_outstandingtoken'),(45,'Can add course',12,'add_course'),(46,'Can change course',12,'change_course'),(47,'Can delete course',12,'delete_course'),(48,'Can view course',12,'view_course'),(49,'Can add level course',13,'add_levelcourse'),(50,'Can change level course',13,'change_levelcourse'),(51,'Can delete level course',13,'delete_levelcourse'),(52,'Can view level course',13,'view_levelcourse'),(53,'Can add discipline',14,'add_discipline'),(54,'Can change discipline',14,'change_discipline'),(55,'Can delete discipline',14,'delete_discipline'),(56,'Can view discipline',14,'view_discipline');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authentication_user`
--

DROP TABLE IF EXISTS `authentication_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authentication_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `bday` date NOT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_trainer` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `auth_provider` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authentication_user`
--

LOCK TABLES `authentication_user` WRITE;
/*!40000 ALTER TABLE `authentication_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `authentication_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authentication_user_groups`
--

DROP TABLE IF EXISTS `authentication_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authentication_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `authentication_user_groups_user_id_group_id_8af031ac_uniq` (`user_id`,`group_id`),
  KEY `authentication_user_groups_group_id_6b5c44b7_fk_auth_group_id` (`group_id`),
  CONSTRAINT `authentication_user__user_id_30868577_fk_authentic` FOREIGN KEY (`user_id`) REFERENCES `authentication_user` (`id`),
  CONSTRAINT `authentication_user_groups_group_id_6b5c44b7_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authentication_user_groups`
--

LOCK TABLES `authentication_user_groups` WRITE;
/*!40000 ALTER TABLE `authentication_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `authentication_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authentication_user_user_permissions`
--

DROP TABLE IF EXISTS `authentication_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authentication_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `authentication_user_user_user_id_permission_id_ec51b09f_uniq` (`user_id`,`permission_id`),
  KEY `authentication_user__permission_id_ea6be19a_fk_auth_perm` (`permission_id`),
  CONSTRAINT `authentication_user__permission_id_ea6be19a_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `authentication_user__user_id_736ebf7e_fk_authentic` FOREIGN KEY (`user_id`) REFERENCES `authentication_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authentication_user_user_permissions`
--

LOCK TABLES `authentication_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `authentication_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `authentication_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coach_coach`
--

DROP TABLE IF EXISTS `coach_coach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coach_coach` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title_description` varchar(255) DEFAULT NULL,
  `description` longtext NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `top_discipline_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `bday` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `number` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `coach_coach_unique` (`name`,`surname`,`bday`),
  KEY `coach_coach_top_discipline_id_f861364d_fk_scheda_tu` (`top_discipline_id`),
  KEY `coach_coach_user_id_83c74dc1_fk_authentication_user_id` (`user_id`),
  CONSTRAINT `coach_coach_top_discipline_id_f861364d_fk_scheda_tu` FOREIGN KEY (`top_discipline_id`) REFERENCES `scheda_tutorial_discipline` (`id`),
  CONSTRAINT `coach_coach_user_id_83c74dc1_fk_authentication_user_id` FOREIGN KEY (`user_id`) REFERENCES `authentication_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coach_coach`
--

LOCK TABLES `coach_coach` WRITE;
/*!40000 ALTER TABLE `coach_coach` DISABLE KEYS */;
INSERT INTO `coach_coach` VALUES (1,'Tanta roba','tanta roba ma descrizione','hich','hich video',1,NULL,'Hich','Bho','2022-01-19','hich@gmail.com','3924168393'),(2,'Mi piace fare sport','Ma tanto tanto','vale','791474012',NULL,NULL,'Valerio','Boh','2023-01-21','valerio.boh@gmail.com','3478891735');
/*!40000 ALTER TABLE `coach_coach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coach_coach_level_course`
--

DROP TABLE IF EXISTS `coach_coach_level_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coach_coach_level_course` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `coach_id` bigint NOT NULL,
  `levelcourse_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coach_coach_level_course_coach_id_levelcourse_id_b2d065a1_uniq` (`coach_id`,`levelcourse_id`),
  KEY `coach_coach_level_co_levelcourse_id_72afd761_fk_scheda_tu` (`levelcourse_id`),
  CONSTRAINT `coach_coach_level_co_levelcourse_id_72afd761_fk_scheda_tu` FOREIGN KEY (`levelcourse_id`) REFERENCES `scheda_tutorial_levelcourse` (`id`),
  CONSTRAINT `coach_coach_level_course_coach_id_56d4ad1f_fk_coach_coach_id` FOREIGN KEY (`coach_id`) REFERENCES `coach_coach` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coach_coach_level_course`
--

LOCK TABLES `coach_coach_level_course` WRITE;
/*!40000 ALTER TABLE `coach_coach_level_course` DISABLE KEYS */;
INSERT INTO `coach_coach_level_course` VALUES (1,1,1),(2,1,2);
/*!40000 ALTER TABLE `coach_coach_level_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_authentication_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_authentication_user_id` FOREIGN KEY (`user_id`) REFERENCES `authentication_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (2,'admin','logentry'),(4,'auth','group'),(3,'auth','permission'),(7,'authentication','user'),(1,'coach','coach'),(5,'contenttypes','contenttype'),(9,'django_cron','cronjoblock'),(8,'django_cron','cronjoblog'),(12,'scheda_tutorial','course'),(14,'scheda_tutorial','discipline'),(13,'scheda_tutorial','levelcourse'),(6,'sessions','session'),(10,'token_blacklist','blacklistedtoken'),(11,'token_blacklist','outstandingtoken');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_cron_cronjoblock`
--

DROP TABLE IF EXISTS `django_cron_cronjoblock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_cron_cronjoblock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_name` varchar(200) NOT NULL,
  `locked` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_name` (`job_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_cron_cronjoblock`
--

LOCK TABLES `django_cron_cronjoblock` WRITE;
/*!40000 ALTER TABLE `django_cron_cronjoblock` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_cron_cronjoblock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_cron_cronjoblog`
--

DROP TABLE IF EXISTS `django_cron_cronjoblog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_cron_cronjoblog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(64) NOT NULL,
  `start_time` datetime(6) NOT NULL,
  `end_time` datetime(6) NOT NULL,
  `is_success` tinyint(1) NOT NULL,
  `message` longtext NOT NULL,
  `ran_at_time` time(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `django_cron_cronjoblog_code_is_success_ran_at_time_84da9606_idx` (`code`,`is_success`,`ran_at_time`),
  KEY `django_cron_cronjoblog_code_start_time_4fc78f9d_idx` (`code`,`start_time`),
  KEY `django_cron_cronjoblog_code_start_time_ran_at_time_8b50b8fa_idx` (`code`,`start_time`,`ran_at_time`),
  KEY `django_cron_cronjoblog_code_48865653` (`code`),
  KEY `django_cron_cronjoblog_start_time_d68c0dd9` (`start_time`),
  KEY `django_cron_cronjoblog_end_time_7918602a` (`end_time`),
  KEY `django_cron_cronjoblog_ran_at_time_7fed2751` (`ran_at_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_cron_cronjoblog`
--

LOCK TABLES `django_cron_cronjoblog` WRITE;
/*!40000 ALTER TABLE `django_cron_cronjoblog` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_cron_cronjoblog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2023-01-19 15:02:57.382844'),(2,'contenttypes','0002_remove_content_type_name','2023-01-19 15:02:57.404521'),(3,'auth','0001_initial','2023-01-19 15:02:57.477765'),(4,'auth','0002_alter_permission_name_max_length','2023-01-19 15:02:57.495040'),(5,'auth','0003_alter_user_email_max_length','2023-01-19 15:02:57.501927'),(6,'auth','0004_alter_user_username_opts','2023-01-19 15:02:57.508188'),(7,'auth','0005_alter_user_last_login_null','2023-01-19 15:02:57.513919'),(8,'auth','0006_require_contenttypes_0002','2023-01-19 15:02:57.515824'),(9,'auth','0007_alter_validators_add_error_messages','2023-01-19 15:02:57.521232'),(10,'auth','0008_alter_user_username_max_length','2023-01-19 15:02:57.526855'),(11,'auth','0009_alter_user_last_name_max_length','2023-01-19 15:02:57.532617'),(12,'auth','0010_alter_group_name_max_length','2023-01-19 15:02:57.542480'),(13,'auth','0011_update_proxy_permissions','2023-01-19 15:02:57.553666'),(14,'auth','0012_alter_user_first_name_max_length','2023-01-19 15:02:57.562691'),(15,'authentication','0001_initial','2023-01-19 15:02:57.662905'),(16,'admin','0001_initial','2023-01-19 15:02:57.718168'),(17,'admin','0002_logentry_remove_auto_add','2023-01-19 15:02:57.729777'),(18,'admin','0003_logentry_add_action_flag_choices','2023-01-19 15:02:57.737694'),(19,'scheda_tutorial','0001_initial','2023-01-19 15:02:57.771140'),(20,'scheda_tutorial','0002_alter_course_title','2023-01-19 15:02:57.783337'),(21,'scheda_tutorial','0003_levelcourse_gender','2023-01-19 15:02:57.797910'),(22,'scheda_tutorial','0004_auto_20230117_2211','2023-01-19 15:02:58.006211'),(23,'scheda_tutorial','0005_auto_20230118_0012','2023-01-19 15:02:58.070106'),(24,'scheda_tutorial','0006_levelcourse_scheda_tutorial_levelcourse_unique','2023-01-19 15:02:58.085337'),(25,'scheda_tutorial','0007_delete_coatch','2023-01-19 15:02:58.100030'),(26,'coach','0001_initial','2023-01-19 15:02:58.190802'),(27,'coach','0002_auto_20230118_2012','2023-01-19 15:02:58.302018'),(28,'coach','0003_auto_20230118_2223','2023-01-19 15:02:58.428229'),(29,'django_cron','0001_initial','2023-01-19 15:02:58.489425'),(30,'django_cron','0002_remove_max_length_from_CronJobLog_message','2023-01-19 15:02:58.494523'),(31,'django_cron','0003_cronjoblock','2023-01-19 15:02:58.504524'),(32,'sessions','0001_initial','2023-01-19 15:02:58.521967'),(33,'token_blacklist','0001_initial','2023-01-19 15:02:58.589641'),(34,'token_blacklist','0002_outstandingtoken_jti_hex','2023-01-19 15:02:58.611218'),(35,'token_blacklist','0003_auto_20171017_2007','2023-01-19 15:02:58.627969'),(36,'token_blacklist','0004_auto_20171017_2013','2023-01-19 15:02:58.659204'),(37,'token_blacklist','0005_remove_outstandingtoken_jti','2023-01-19 15:02:58.682033'),(38,'token_blacklist','0006_auto_20171017_2113','2023-01-19 15:02:58.702512'),(39,'token_blacklist','0007_auto_20171017_2214','2023-01-19 15:02:58.828417'),(40,'token_blacklist','0008_migrate_to_bigautofield','2023-01-19 15:02:58.924490'),(41,'token_blacklist','0010_fix_migrate_to_bigautofield','2023-01-19 15:02:58.945759'),(42,'token_blacklist','0011_linearizes_history','2023-01-19 15:02:58.948145'),(43,'token_blacklist','0012_alter_outstandingtoken_user','2023-01-19 15:02:58.960395'),(44,'scheda_tutorial','0008_auto_20230121_1831','2023-01-21 18:48:58.453527'),(45,'scheda_tutorial','0009_auto_20230124_1646','2023-01-24 18:39:29.141577');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scheda_tutorial_course`
--

DROP TABLE IF EXISTS `scheda_tutorial_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scheda_tutorial_course` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `discipline_id` bigint NOT NULL,
  `description` longtext NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `title_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `scheda_tutorial_course_title_0fa12d20_uniq` (`title`),
  KEY `scheda_tutorial_course_discipline_id_4d5d02fc` (`discipline_id`),
  CONSTRAINT `scheda_tutorial_cour_discipline_id_4d5d02fc_fk_scheda_tu` FOREIGN KEY (`discipline_id`) REFERENCES `scheda_tutorial_discipline` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scheda_tutorial_course`
--

LOCK TABLES `scheda_tutorial_course` WRITE;
/*!40000 ALTER TABLE `scheda_tutorial_course` DISABLE KEYS */;
INSERT INTO `scheda_tutorial_course` VALUES (1,'Trazioni',1,'descrizione del tutorial','petto','tipi che fanno trazioni','Trazioni sexy'),(2,'Diventare fortissimo',1,'Questa scheda ti renderà fortissimo','petto','default','Una scheda accessibile a tutti'),(3,'Prova',3,'prova','braccia','default','prova');
/*!40000 ALTER TABLE `scheda_tutorial_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scheda_tutorial_discipline`
--

DROP TABLE IF EXISTS `scheda_tutorial_discipline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scheda_tutorial_discipline` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scheda_tutorial_discipline`
--

LOCK TABLES `scheda_tutorial_discipline` WRITE;
/*!40000 ALTER TABLE `scheda_tutorial_discipline` DISABLE KEYS */;
INSERT INTO `scheda_tutorial_discipline` VALUES (1,'Powerlifting','power'),(2,'posturale_rieducazione_motoria','post'),(3,'calisthenics','cali'),(4,'post_fisioterapia_dopo_infortunio','post_fisio');
/*!40000 ALTER TABLE `scheda_tutorial_discipline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scheda_tutorial_levelcourse`
--

DROP TABLE IF EXISTS `scheda_tutorial_levelcourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scheda_tutorial_levelcourse` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `level` varchar(11) NOT NULL,
  `requirements` longtext NOT NULL,
  `goals` longtext NOT NULL,
  `required_items` longtext NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `course_id` bigint NOT NULL,
  `gender` varchar(10) NOT NULL,
  `goals_video` varchar(255) DEFAULT NULL,
  `video` varchar(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `frequency` varchar(255) NOT NULL,
  `requirements_video` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `scheda_tutorial_levelcourse_unique` (`level`,`gender`,`course_id`),
  KEY `scheda_tutorial_leve_course_id_84ddb514_fk_scheda_tu` (`course_id`),
  CONSTRAINT `scheda_tutorial_leve_course_id_84ddb514_fk_scheda_tu` FOREIGN KEY (`course_id`) REFERENCES `scheda_tutorial_course` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scheda_tutorial_levelcourse`
--

LOCK TABLES `scheda_tutorial_levelcourse` WRITE;
/*!40000 ALTER TABLE `scheda_tutorial_levelcourse` DISABLE KEYS */;
INSERT INTO `scheda_tutorial_levelcourse` VALUES (1,'BEGINNER','riuscire a fare le trazioni','fare 10 trazioni','palestra',100.00,1,'M','goals','video','4 Settimane','Ogni giorno',NULL),(2,'PRIMI_PASSI','string','string','string',100.00,3,'M','string','string','string','string','string');
/*!40000 ALTER TABLE `scheda_tutorial_levelcourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_blacklistedtoken`
--

DROP TABLE IF EXISTS `token_blacklist_blacklistedtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_blacklistedtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `blacklisted_at` datetime(6) NOT NULL,
  `token_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_id` (`token_id`),
  CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY (`token_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_blacklistedtoken`
--

LOCK TABLES `token_blacklist_blacklistedtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_outstandingtoken`
--

DROP TABLE IF EXISTS `token_blacklist_outstandingtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_outstandingtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` longtext NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `jti` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` (`jti`),
  KEY `token_blacklist_outs_user_id_83bc629a_fk_authentic` (`user_id`),
  CONSTRAINT `token_blacklist_outs_user_id_83bc629a_fk_authentic` FOREIGN KEY (`user_id`) REFERENCES `authentication_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_outstandingtoken`
--

LOCK TABLES `token_blacklist_outstandingtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-31 16:51:48
