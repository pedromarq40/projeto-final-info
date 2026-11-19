
/* create database if not exists pulsofit;

use pulsofit; */

CREATE TABLE IF NOT EXISTS professor(
    CPF VARCHAR(11) PRIMARY KEY,
    email VARCHAR(35) NOT NULL UNIQUE,
    nome_completo VARCHAR(40) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    data_criacao DATE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    especializacao VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS aluno(
    CPF VARCHAR(11) PRIMARY KEY,
    altura DECIMAL(5, 2) NOT NULL,
    peso DECIMAL(5, 2) NOT NULL,
    problemas_saude VARCHAR(50) NOT NULL,
    email VARCHAR(35) NOT NULL UNIQUE,
    nome_completo VARCHAR(40) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    data_criacao DATE NOT NULL DEFAULT (NOW()),
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS exercicio(
    id_exercicio INT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL,
    video VARCHAR(260)
);

CREATE TABLE IF NOT EXISTS FichaDeTreino(
    id_ficha INT PRIMARY KEY,
    CPF VARCHAR(11) NOT NULL UNIQUE,
    foco VARCHAR(15) NOT NULL,
    tipo VARCHAR(15) NOT NULL,
    validade DATE NOT NULL,
    FOREIGN KEY (CPF) REFERENCES aluno(CPF)
);

CREATE TABLE IF NOT EXISTS RegistroDeTreino(
    data_registro DATE NOT NULL,
    id_ficha INT NOT NULL,
    hora TIME NOT NULL,
    duracao TIME NOT NULL,
    PRIMARY KEY(data_registro, id_ficha),
    FOREIGN KEY (id_ficha) REFERENCES FichaDeTreino(id_ficha)
);

CREATE TABLE IF NOT EXISTS ExercicioFicha(
    id_exercicio INT NOT NULL,
    id_ficha INT NOT NULL,
    carga INT NOT NULL,
    series INT NOT NULL,
    repeticoes INT NOT NULL,
    PRIMARY KEY(id_exercicio, id_ficha),
    FOREIGN KEY (id_exercicio) REFERENCES exercicio(id_exercicio),
    FOREIGN KEY (id_ficha) REFERENCES FichaDeTreino(id_ficha)
);

CREATE TABLE IF NOT EXISTS plano(
    id_plano INT PRIMARY KEY,
    valor_mensal DECIMAL(10, 2) NOT NULL,
    nome VARCHAR(15) NOT NULL,
    efetivo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS mensalidade(
    data_geracao DATE NOT NULL,
    CPF VARCHAR(11) NOT NULL,
    id_plano INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    vencimento DATE NOT NULL,
    data_pagamento DATE,
    PRIMARY KEY (data_geracao, CPF, id_plano),
    FOREIGN KEY (CPF) REFERENCES aluno(CPF),
    FOREIGN KEY (id_plano) REFERENCES plano(id_plano)
);

CREATE TABLE IF NOT EXISTS assinatura(
    id_assinatura INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_plano INT NOT NULL,
    CPF VARCHAR(11) NOT NULL UNIQUE,
    data_assinatura DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    FOREIGN KEY (id_plano) REFERENCES plano(id_plano),
    FOREIGN KEY (CPF) REFERENCES aluno(CPF)
);

/* INSERTS */

INSERT IGNORE INTO professor
VALUES
(
    '11231221312',
    'carlosHr@gmail.com',
    'Carlos Henrique',
    '82987623212',
    '2026-01-10',
    '223450',
    'Musculação'
),
(
    '98765432100',
    'anap1@gmail.com',
    'Ana Paula',
    '82987654321',
    '2026-03-15',
    '654321',
    'Ginastica'
);

INSERT IGNORE INTO aluno
VALUES
(
    '12546913214',
    1.75,
    75,
    'Nenhum',
    'joao@gmail.com',
    'Joao Silva',
    '82993213222',
    '2026-02-01',
    '123456'
),
(
    '78712366213',
    1.68,
    65,
    'Asma',
    'maria@gmail.com',
    'Maria Santos',
    '82988812830',
    '2026-02-02',
    '123456'
);

INSERT IGNORE INTO exercicio
VALUES
(
    1,
    'Supino reto',
    'https://youtu.be/fG_03xSzT2s?si=TrAU4IGX_Nonouii'
),
(
    2,
    'Agachamento livre',
    'https://youtube.com/shorts/JWFljl14kSc?si=g8X_HvuZcONSD2OV'
),
(
    3,
    'Rosca direta',
    'https://youtube.com/shorts/Yp-SuCCqui8?si=2IQELO8U0n6f0w_7'
);

INSERT IGNORE INTO plano
VALUES
(1, 89.90, 'Mensal', TRUE),
(2, 149.90, 'Trimestral', TRUE);

INSERT IGNORE INTO FichaDeTreino
VALUES
(
    1,
    '12546913214',
    'Hipertrofia',
    'Superior',
    '2026-12-01'
),
(
    2,
    '78712366213',
    'Resistencia',
    'Inferior',
    '2026-12-01'
);

INSERT IGNORE INTO RegistroDeTreino
VALUES
('2026-11-10', 1, '08:00:00', '01:00:00'),
('2026-11-10', 2, '09:00:00', '00:50:00'),
('2026-11-11', 1, '08:30:00', '01:10:00');

INSERT IGNORE INTO ExercicioFicha
VALUES
(1, 1, 30, 3, 12),
(3, 1, 15, 3, 10),
(2, 2, 40, 4, 12);

INSERT IGNORE INTO assinatura
(id_plano, CPF, data_assinatura, data_vencimento)
VALUES
(1, '12546913214', '2026-11-01', '2026-12-01'),
(2, '78712366213', '2026-11-01', '2027-02-01');

INSERT IGNORE INTO mensalidade
VALUES
(
    '2026-11-01',
    '12546913214',
    1,
    89.90,
    '2026-11-10',
    '2026-11-08'
),
(
    '2026-11-01',
    '78712366213',
    2,
    149.90,
    '2026-11-10',
    '2026-11-09'
);
