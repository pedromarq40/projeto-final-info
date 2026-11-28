
/* create database if not exists pulsofit;

use pulsofit; */

CREATE TABLE IF NOT EXISTS professor(
    CPF VARCHAR(11) PRIMARY KEY,
    email VARCHAR(35) NOT NULL UNIQUE,
    nome_completo VARCHAR(40) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    data_criacao DATE NOT NULL DEFAULT (NOW()),
    senha VARCHAR(255) NOT NULL,
    especializacao VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS aluno(
    CPF VARCHAR(11) PRIMARY KEY,
    altura DECIMAL(5, 2) NOT NULL,
    peso DECIMAL(5, 2) NOT NULL,
    problemas_saude VARCHAR(50),
    email VARCHAR(35) NOT NULL UNIQUE,
    nome_completo VARCHAR(40) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    data_criacao DATE NOT NULL DEFAULT (NOW()),
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS admin(
    CPF VARCHAR(11) PRIMARY KEY,
    nome_completo VARCHAR(40) NOT NULL,
    email VARCHAR(35) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS exercicio(
    id_exercicio INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20) NOT NULL,
    video VARCHAR(260)
);

CREATE TABLE IF NOT EXISTS FichaDeTreino(
    id_ficha INT PRIMARY KEY,
    CPF VARCHAR(11) NOT NULL,
    letra CHAR(1) NOT NULL,
    foco VARCHAR(15) NOT NULL,
    tipo VARCHAR(15) NOT NULL,
    validade DATE NOT NULL,
    INDEX idx_ficha_cpf (CPF),
    CONSTRAINT fk_ficha_aluno_nova
        FOREIGN KEY (CPF) REFERENCES aluno(CPF)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RegistroDeTreino(
    id_registro INT PRIMARY KEY AUTO_INCREMENT,
    data_registro DATE NOT NULL,
    id_ficha INT NOT NULL,
    hora TIME NOT NULL,
    duracao TIME NOT NULL,
    UNIQUE (data_registro, id_ficha, hora),
    FOREIGN KEY (id_ficha) REFERENCES FichaDeTreino(id_ficha)
);

CREATE TABLE IF NOT EXISTS ExercicioFicha(
    id_exercicio INT NOT NULL,
    id_ficha INT NOT NULL,
    carga INT NOT NULL,
    series INT NOT NULL,
    repeticoes INT NOT NULL,
    ordem INT NOT NULL,
    PRIMARY KEY(id_exercicio, id_ficha),
    UNIQUE(id_ficha, ordem),
    FOREIGN KEY (id_exercicio) REFERENCES exercicio(id_exercicio),
    FOREIGN KEY (id_ficha) REFERENCES FichaDeTreino(id_ficha)
);

CREATE TABLE IF NOT EXISTS ExercicioRealizado(
    id_realizado INT PRIMARY KEY AUTO_INCREMENT,
    id_registro INT NOT NULL,
    id_exercicio INT NOT NULL,
    carga_realizada DECIMAL(6, 2) NOT NULL,
    series_realizadas INT NOT NULL,
    repeticoes_realizadas INT NOT NULL,
    concluido BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_registro) REFERENCES RegistroDeTreino(id_registro)
        ON DELETE CASCADE,
    FOREIGN KEY (id_exercicio) REFERENCES exercicio(id_exercicio),
    UNIQUE (id_registro, id_exercicio)
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
    status ENUM('pendente', 'paga', 'cancelada')
        DEFAULT 'pendente',
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
    status ENUM('ativa', 'cancelada') NOT NULL DEFAULT 'ativa',
    FOREIGN KEY (id_plano) REFERENCES plano(id_plano),
    FOREIGN KEY (CPF) REFERENCES aluno(CPF)
);
/* INSERTS */

INSERT IGNORE INTO admin
VALUES (
    '00000000000',
    'João Fonseca',
    'admin@gmail.com',
    '$2b$10$ZRknfTE0Qahv2kT0YOYaVeR38QqXojx2XulLe3SAIxJYzzaeONABG'
);

INSERT IGNORE INTO professor
(CPF, email, nome_completo, telefone, data_criacao, senha, especializacao)
VALUES
('18922826827', 'marcos@gmail.com', 'Marcos Oliveira', '82987641392', '2026-03-10', '$2b$10$EigMBj5mdfJZN2J.akIZOudnJuHqZRpyhJhxTXco5hmJkAu1D3PUy', 'Musculacao'),
('83568803518', 'fernanda@gmail.com', 'Fernanda Lima', '82991280547', '2026-03-12', '$2b$10$EigMBj5mdfJZN2J.akIZOudnJuHqZRpyhJhxTXco5hmJkAu1D3PUy', 'Pilates'),
('97362046340', 'roberto@gmail.com', 'Roberto Costa', '82984523916', '2026-03-15', '$2b$10$EigMBj5mdfJZN2J.akIZOudnJuHqZRpyhJhxTXco5hmJkAu1D3PUy', 'Musculacao'),
('66951360413', 'juliana@gmail.com', 'Juliana Alves', '82993361704', '2026-03-18', '$2b$10$EigMBj5mdfJZN2J.akIZOudnJuHqZRpyhJhxTXco5hmJkAu1D3PUy', 'Ginastica'),
('03903794686', 'pedro@gmail.com', 'Pedro Martins', '82988752063', '2026-03-20', '$2b$10$EigMBj5mdfJZN2J.akIZOudnJuHqZRpyhJhxTXco5hmJkAu1D3PUy', 'Musculacao'),
('44327115231', 'camila@gmail.com', 'Camila Souza', '82992047615', '2026-03-22', '$2b$10$EigMBj5mdfJZN2J.akIZOudnJuHqZRpyhJhxTXco5hmJkAu1D3PUy', 'Pilates'),
('18097300400', 'andre@gmail.com', 'Andre Ribeiro', '82985416297', '2026-03-25', '$2b$10$EigMBj5mdfJZN2J.akIZOudnJuHqZRpyhJhxTXco5hmJkAu1D3PUy', 'Musculacao'),
('12978444754', 'patricia@gmail.com', 'Patricia Gomes', '82997603158', '2026-03-28', '$2b$10$EigMBj5mdfJZN2J.akIZOudnJuHqZRpyhJhxTXco5hmJkAu1D3PUy', 'Ginastica'),
('58264193720', 'lucas@gmail.com', 'Lucas Ferreira', '82976381542', '2026-03-30', '$2b$10$EigMBj5mdfJZN2J.akIZOudnJuHqZRpyhJhxTXco5hmJkAu1D3PUy', 'Musculacao'),
('74192563810', 'mariana@gmail.com', 'Mariana Santos', '82968129453', '2026-04-02', '$2b$10$EigMBj5mdfJZN2J.akIZOudnJuHqZRpyhJhxTXco5hmJkAu1D3PUy', 'Pilates');

INSERT IGNORE INTO aluno
(CPF, altura, peso, problemas_saude, email, nome_completo, telefone, data_criacao, senha)
VALUES
('42436989532', 1.72, 78, 'Nenhum', 'bruno@gmail.com', 'Bruno Ferreira', '82986521347', '2026-04-01', '$2b$10$ZRknfTE0Qahv2kT0YOYaVeR38QqXojx2XulLe3SAIxJYzzaeONABG'),
('24004054419', 1.65, 62, 'Nenhum', 'carolina@gmail.com', 'Carolina Mendes', '82993471852', '2026-04-02', '$2b$10$ZRknfTE0Qahv2kT0YOYaVeR38QqXojx2XulLe3SAIxJYzzaeONABG'),
('16097074603', 1.80, 85, 'Nenhum', 'lucas@gmail.com', 'Lucas Pereira', '82987652941', '2026-04-03', '$2b$10$ZRknfTE0Qahv2kT0YOYaVeR38QqXojx2XulLe3SAIxJYzzaeONABG'),
('67746172555', 1.69, 70, 'Asma', 'amanda@gmail.com', 'Amanda Rodrigues', '82994516382', '2026-04-04', '$2b$10$ZRknfTE0Qahv2kT0YOYaVeR38QqXojx2XulLe3SAIxJYzzaeONABG'),
('97171022102', 1.76, 82, 'Nenhum', 'gabriel@gmail.com', 'Gabriel Almeida', '82981269435', '2026-04-05', '$2b$10$ZRknfTE0Qahv2kT0YOYaVeR38QqXojx2XulLe3SAIxJYzzaeONABG'),
('63061524908', 1.60, 58, 'Nenhum', 'leticia@gmail.com', 'Leticia Carvalho', '82998732146', '2026-04-06', '$2b$10$ZRknfTE0Qahv2kT0YOYaVeR38QqXojx2XulLe3SAIxJYzzaeONABG'),
('20573419094', 1.83, 90, 'Nenhum', 'rafael@gmail.com', 'Rafael Nunes', '82982374519', '2026-04-07', '$2b$10$ZRknfTE0Qahv2kT0YOYaVeR38QqXojx2XulLe3SAIxJYzzaeONABG'),
('53884085662', 1.67, 66, 'Nenhum', 'isabela@gmail.com', 'Isabela Moraes', '82995621873', '2026-04-08', '$2b$10$ZRknfTE0Qahv2kT0YOYaVeR38QqXojx2XulLe3SAIxJYzzaeONABG'),
('81529643710', 1.75, 74, 'Nenhum', 'thiago@gmail.com', 'Thiago Ribeiro', '82974163825', '2026-04-09', '$2b$10$ZRknfTE0Qahv2kT0YOYaVeR38QqXojx2XulLe3SAIxJYzzaeONABG'),
('39275816420', 1.68, 63, 'Nenhum', 'beatriz@gmail.com', 'Beatriz Santos', '82985392741', '2026-04-10', '$2b$10$ZRknfTE0Qahv2kT0YOYaVeR38QqXojx2XulLe3SAIxJYzzaeONABG');

UPDATE admin
SET senha = '$2b$10$ZRknfTE0Qahv2kT0YOYaVeR38QqXojx2XulLe3SAIxJYzzaeONABG'
WHERE email = 'admin@gmail.com';

INSERT IGNORE INTO exercicio
(id_exercicio, nome, video)
VALUES
(1, 'Supino reto', 'https://youtu.be/fG_03xSzT2s?si=TrAU4IGX_Nonouii'),
(2, 'Agachamento livre', 'https://youtube.com/shorts/JWFljl14kSc?si=g8X_HvuZcONSD2OV'),
(3, 'Rosca direta', 'https://youtube.com/shorts/Yp-SuCCqui8?si=2IQELO8U0n6f0w_7'),
(4, 'Remada baixa', 'https://www.youtube.com/shorts/zw0lUIPCq-U?feature=share'),
(5, 'Puxada frontal', 'https://www.youtube.com/shorts/_2MfZAj98tk?feature=share'),
(6, 'Leg press', 'https://www.youtube.com/shorts/NY5fw4Zaofg?feature=share'),
(7, 'Cadeira extensora', 'https://www.youtube.com/shorts/PzIfB9MiiX8?feature=share'),
(8, 'Mesa flexora', 'https://www.youtube.com/shorts/IXg1PQ_5gmw?feature=share'),
(9, 'Desenvolvimento com halteres', 'https://www.youtube.com/shorts/5I7ogOjvdnc?feature=share'),
(10, 'Elevacao lateral', 'https://www.youtube.com/shorts/ot9nwSC1JnA?feature=share');

INSERT IGNORE INTO plano (id_plano, valor_mensal, nome, efetivo)
VALUES
(1, 89.90, 'Mensal', TRUE),
(2, 254.70, 'Trimestral', TRUE);

INSERT IGNORE INTO FichaDeTreino
(id_ficha, CPF, letra, foco, tipo, validade)
VALUES
(1, '42436989532', 'A', 'Hipertrofia', 'Superior', '2027-01-01'),
(2, '24004054419', 'A', 'Resistencia', 'Inferior', '2027-01-01'),
(3, '16097074603', 'A', 'Hipertrofia', 'Superior', '2027-01-05'),
(4, '67746172555', 'A', 'Condicionamento', 'Inferior', '2027-01-05'),
(5, '97171022102', 'A', 'Hipertrofia', 'Superior', '2027-01-10'),
(6, '63061524908', 'A', 'Resistencia', 'Inferior', '2027-01-10'),
(7, '20573419094', 'A', 'Hipertrofia', 'Superior', '2027-01-15'),
(8, '53884085662', 'A', 'Condicionamento', 'Inferior', '2027-01-15'),
(9, '81529643710', 'A', 'Hipertrofia', 'Superior', '2027-01-20'),
(10, '39275816420', 'A', 'Resistencia', 'Inferior', '2027-01-20');


INSERT IGNORE INTO ExercicioFicha
(id_exercicio, id_ficha, carga, series, repeticoes, ordem)
VALUES
(1, 1, 25, 3, 12, 1),
(4, 1, 30, 3, 12, 2),
(5, 1, 25, 3, 12, 3),
(9, 1, 10, 3, 12, 4),

(2, 2, 30, 3, 12, 1),
(6, 2, 80, 4, 10, 2),
(7, 2, 35, 3, 15, 3),
(8, 2, 15, 3, 10, 4),

(3, 3, 15, 3, 12, 1),
(1, 3, 25, 3, 12, 2),
(4, 3, 30, 3, 12, 3),
(9, 3, 10, 3, 12, 4),

(6, 4, 80, 4, 10, 1),
(2, 4, 30, 3, 12, 2),
(7, 4, 35, 3, 15, 3),
(8, 4, 15, 3, 10, 4),

(4, 5, 30, 3, 12, 1),
(1, 5, 25, 3, 12, 2),
(5, 5, 25, 3, 12, 3),
(3, 5, 15, 3, 12, 4),

(7, 6, 35, 3, 15, 1),
(2, 6, 30, 3, 12, 2),
(6, 6, 80, 4, 10, 3),
(8, 6, 15, 3, 10, 4),

(9, 7, 10, 3, 12, 1),
(1, 7, 25, 3, 12, 2),
(4, 7, 30, 3, 12, 3),
(10, 7, 10, 3, 12, 4),

(8, 8, 15, 3, 10, 1),
(2, 8, 30, 3, 12, 2),
(6, 8, 80, 4, 10, 3),
(7, 8, 35, 3, 15, 4),

(10, 9, 10, 3, 12, 1),
(1, 9, 25, 3, 12, 2),
(5, 9, 25, 3, 12, 3),
(3, 9, 15, 3, 12, 4),

(2, 10, 35, 4, 10, 1),
(6, 10, 80, 4, 10, 2),
(7, 10, 35, 3, 15, 3),
(8, 10, 15, 3, 10, 4);


INSERT IGNORE INTO RegistroDeTreino
(data_registro, id_ficha, hora, duracao)
VALUES
('2026-04-10', 1, '08:00:00', '01:05:00'),
('2026-04-11', 2, '09:15:00', '00:55:00'),
('2026-04-12', 3, '07:30:00', '01:10:00'),
('2026-04-13', 4, '10:00:00', '00:50:00'),
('2026-04-14', 5, '08:30:00', '01:15:00'),
('2026-04-15', 6, '09:00:00', '00:45:00'),
('2026-04-16', 7, '07:45:00', '01:00:00'),
('2026-04-17', 8, '10:30:00', '00:55:00'),
('2026-04-18', 9, '08:15:00', '01:20:00'),
('2026-04-19', 10, '09:30:00', '01:05:00');

INSERT IGNORE INTO ExercicioRealizado
(id_registro, id_exercicio, carga_realizada, series_realizadas, repeticoes_realizadas, concluido)
SELECT
    r.id_registro,
    ef.id_exercicio,
    ef.carga,
    ef.series,
    ef.repeticoes,
    TRUE
FROM RegistroDeTreino r
INNER JOIN ExercicioFicha ef
    ON ef.id_ficha = r.id_ficha
WHERE r.data_registro BETWEEN '2026-04-10' AND '2026-04-19';

INSERT IGNORE INTO assinatura
(id_plano, CPF, data_assinatura, data_vencimento)
VALUES
(1, '42436989532', '2026-11-01', '2026-12-01'),
(2, '24004054419', '2026-11-02', '2027-02-02'),
(1, '16097074603', '2026-11-03', '2026-12-03'),
(2, '67746172555', '2026-11-04', '2027-02-04'),
(1, '97171022102', '2026-11-05', '2026-12-05'),
(2, '63061524908', '2026-11-06', '2027-02-06'),
(1, '20573419094', '2026-11-07', '2026-12-07'),
(2, '53884085662', '2026-11-08', '2027-02-08'),
(1, '81529643710', '2026-11-09', '2026-12-09'),
(2, '39275816420', '2026-11-10', '2027-02-10');

INSERT IGNORE INTO mensalidade
(data_geracao, CPF, id_plano, valor, vencimento, data_pagamento, status)
VALUES
('2026-11-01', '42436989532', 1, 89.90, '2026-12-01', NULL, 'pendente'),
('2026-11-01', '24004054419', 2, 254.70, '2027-02-02', NULL, 'pendente'),
('2026-11-01', '16097074603', 1, 89.90, '2026-12-03', NULL, 'pendente'),
('2026-11-01', '67746172555', 2, 254.70, '2027-02-04', NULL, 'pendente'),
('2026-11-01', '97171022102', 1, 89.90, '2026-12-05', NULL, 'pendente'),
('2026-11-01', '63061524908', 2, 254.70, '2027-02-06', NULL, 'pendente'),
('2026-11-01', '20573419094', 1, 89.90, '2026-12-07', NULL, 'pendente'),
('2026-11-01', '53884085662', 2, 254.70, '2027-02-08', NULL, 'pendente'),
('2026-11-01', '81529643710', 1, 89.90, '2026-12-09', NULL, 'pendente'),
('2026-11-01', '39275816420', 2, 254.70, '2027-02-10', NULL, 'pendente');
