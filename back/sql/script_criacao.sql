/*create database if not exists pulsofit;

use pulsofit;*/

create table if not exists professor(
    CPF varchar(11) primary key,
    email varchar(35),
    nome_completo varchar(40),
    telefone varchar(11),
    data_criacao date,
    senha varchar(255),
    especializacao varchar(20)
);

create table if not exists aluno(
    CPF varchar(11) primary key,
    altura DECIMAL(5, 2),
    peso DECIMAL(5, 2),
    problemas_saude varchar(50),
    email varchar(35),
    nome_completo varchar(40),
    telefone varchar(11),
    data_criacao date,
    senha varchar(255)
);

create table if not exists exercicio(
    id_exercicio int primary key,
    nome varchar(20),
    video varchar(260)
);

create table if not exists FichaDeTreino(
    id_ficha int primary key,
    CPF varchar(11) unique,
    foreign key (CPF) references aluno(CPF),
    foco varchar(15),
    tipo varchar(15),
    validade date
);

create table if not exists RegistroDeTreino(
    data_registro date,
    id_ficha int,
    foreign key (id_ficha) references FichaDeTreino(id_ficha),
    hora time,
    duracao time,
    primary key(data_registro, id_ficha)
);

create table if not exists ExercicioFicha(
    id_exercicio int,
    foreign key (id_exercicio) references exercicio(id_exercicio),
    id_ficha int,
    foreign key (id_ficha) references FichaDeTreino(id_ficha),
    carga int,
    series int,
    repeticoes int,
    primary key(id_exercicio, id_ficha)
);

create table if not exists plano(
    id_plano int primary key,
    valor_mensal decimal(10, 2),
    nome varchar(15)
);

create table if not exists mensalidade(
    data_geracao date,
    CPF varchar(11),
    foreign key (CPF) references aluno(CPF),
    id_plano int,
    foreign key (id_plano) references plano(id_plano),
    valor decimal(10, 2),
    vencimento date,
    data_pagamento date,
    primary key (data_geracao, CPF, id_plano)
);

create table if not exists assinatura(
    id_plano int primary key,
    foreign key (id_plano) references plano(id_plano),
    CPF varchar(11) unique,
    foreign key (CPF) references aluno(CPF),
    data_assinatura date,
    data_vencimento date
);

/*inserts*/
INSERT INTO
    professor
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

INSERT INTO
    aluno
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

INSERT INTO
    exercicio
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

INSERT INTO
    plano
VALUES
    (1, 89.90, 'Mensal'),
    (2, 149.90, 'Trimestral');

INSERT INTO
    FichaDeTreino
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

INSERT INTO
    RegistroDeTreino
VALUES
    ('2026-11-10', 1, '08:00:00', '01:00:00'),
    ('2026-11-10', 2, '09:00:00', '00:50:00'),
    ('2026-11-11', 1, '08:30:00', '01:10:00');

INSERT INTO
    ExercicioFicha
VALUES
    (1, 1, 30, 3, 12),
    (3, 1, 15, 3, 10),
    (2, 2, 40, 4, 12);

INSERT INTO
    assinatura
VALUES
    (1, '12546913214', '2026-11-01', '2026-12-01'),
    (2, '78712366213', '2026-11-01', '2027-02-01');

INSERT INTO
    mensalidade
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