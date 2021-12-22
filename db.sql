DROP DATABASE IF EXISTS tickettwo;
CREATE DATABASE tickettwo;

USE tickettwo;

DROP TABLE IF EXISTS `utente`;
CREATE TABLE `utente` (
  `UID` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(25) NOT NULL,
  `nome` varchar(25) NOT NULL,
  `psw` varchar(25) NOT NULL,
  `path_image_profile` varchar(255),
  `is_gestore` boolean DEFAULT 1,
  PRIMARY KEY (`UID`)
);
INSERT INTO `utente` (nome, email, psw, is_gestore) VALUES ('Ricky', 'rickyb@gmail.com', 'Speck&Grana', 0),
	('Davide', 'davimb@gmail.com', 'magnagatti01', 0),
 	('Elena', 'ele@outlook.it', 'crauti.wurstel', 0),
	('MegaEventi', 'money@gmail.com', 'EventoUgualeSoldi', 1),
	('Giorgio', 'giogioacciuga@outlook.it', 'cannolino89', 0),
	('Sofia', 'sofi.auro@gmail.com', 'cioccolatonutella', 0),
	('Federica', 'fedelove@gmail.com', 'LoveLoveLove', 0),
	('Anna', 'annina@outlook.it', 'BelloIlSole', 0),
	('BestGestore', 'the.best@gmail.com', 'SoloIlTop', 1),
	('Ginevra', 'gine@outlook.it', 'risottino54', 0);

DROP TABLE IF EXISTS `cliente`;
CREATE TABLE `cliente` (
  `UID` int(11) NOT NULL,
  `cognome` varchar(25) NOT NULL,
  `data_nascita` date NOT NULL,
  `metodo_pagamento` varchar(25) DEFAULT NULL,
  `residenza` varchar(25) NOT NULL,
  PRIMARY KEY (`UID`),
  CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `utente` (`UID`)
);
INSERT INTO `cliente` VALUES ( 1, 'Bonaccorsi', "2000-06-10", 'Google Pay', 'Trento' ),
	( 2, 'Morassut', "1994-12-20", 'Google Pay', 'Vicenza' ),
	( 3, 'Badole', "2001-12-03", 'Carta di credito', 'Belluno' ),
	( 5, 'Datteron', "1970-10-25", 'Apple Pay', 'Caltanissetta' ),
	( 6, 'Zatta', "1999-01-01", 'Google Pay', 'Bologna' ),
	( 7, 'Dalle Sasse', "2000-09-15", 'Carta di credito', 'Roma' ),
	( 8, 'Dal Pra', "1989-11-30", 'Google Pay', 'Firenze' ),
	( 10, 'Ventoso', "2001-09-28", 'Postepay', 'Trento' );

DROP TABLE IF EXISTS `gestore`;
CREATE TABLE `gestore` (
  `UID` int(11) NOT NULL,
  `dati_bancari` varchar(25) NOT NULL,
  PRIMARY KEY (`UID`),
  CONSTRAINT `gestore_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `utente` (`UID`)
);
INSERT INTO `gestore` VALUES (4, 'Unicredit S.p.a'),
	(9, 'Poste Italiane - Postepay');

DROP TABLE IF EXISTS `evento`;
CREATE TABLE `evento` (
  `EID` int(11) NOT NULL AUTO_INCREMENT,
  `UID` int(11) NOT NULL,
  `nome` varchar(25) NOT NULL,
  `data_inizio` datetime NOT NULL,
  `data_fine` datetime NOT NULL,
  `luogo` varchar(25) NOT NULL,
  `artisti` varchar(255) NOT NULL,
  `genere` varchar(255) NOT NULL,
  `prezzo` float NOT NULL,
  `path_image_event` varchar(255),
  PRIMARY KEY (`EID`),
  KEY `UID` (`UID`),
  CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `gestore` (`UID`)
);
INSERT INTO `evento` (UID, nome, data_inizio, data_fine, luogo, artisti, genere, prezzo) VALUES (9, 'Ferrock Festival', "2022-07-10 21:00:00", "2022-07-16 01:00:00", 'Vicenza','Vari',	'Rock', 2.98),
	(9, 'Eurovision', "2022-11-10 20:00:00", "2022-11-16 02:00:00", 'Torino', 'Maneskin', 'Vari', 168.00),
	(4, 'MagicTrap', "2021-12-31 23:00:00", "2022-01-01 06:00:00", 'Milano', 'Sfera', 'Trap', 200.00),
	(9, 'HotMusic', "2022-06-09 00:00:00", "2022-06-10 05:00:00", 'Roma',	'Vari', 'Dance', 42.99),
	(4, 'Vasco a Trento', "2021-12-17 19:00:00", "2021-12-19 23:00:00", 'Trento',	'Vasco Rossi', 'Rock', 58.00);

