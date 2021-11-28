/* se non è mai stato creato */
CREATE DATABASE tickettwo;

CREATE TABLE tickettwo.utente (
    UID INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    psw VARCHAR(50) NOT NULL,
    PRIMARY KEY (UID)
);

CREATE TABLE tickettwo.gestore_eventi (
    UID INT NOT NULL,
    dati_bancari VARCHAR(25) NOT NULL,
    PRIMARY KEY (UID),
    FOREIGN KEY (UID)
        REFERENCES tickettwo.utente(UID)
);

CREATE TABLE tickettwo.cliente (
    UID INT NOT NULL,
    data_nascita DATE NOT NULL,
    metodo_pagamento VARCHAR(25),
    residenza VARCHAR(25) NOT NULL,
    PRIMARY KEY (UID),
    FOREIGN KEY (UID)
        REFERENCES tickettwo.utente(UID)
);

CREATE TABLE tickettwo.evento (
    EID INT NOT NULL,
    nome VARCHAR(25) NOT NULL,
    data_inizio DATETIME NOT NULL,
    data_fine DATETIME NOT NULL,
    luogo VARCHAR(25) NOT NULL,
    artisti VARCHAR(255) NOT NULL,
    genere VARCHAR(255) NOT NULL,
    prezzo FLOAT NOT NULL,
    gestito INT NOT NULL,
    PRIMARY KEY (EID),
    FOREIGN KEY (gestito)
        REFERENCES tickettwo.gestore_eventi(UID)
);
