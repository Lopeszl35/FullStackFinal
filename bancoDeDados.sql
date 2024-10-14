CREATE DATABASE BDVagasCandidatos;
USE BDVagasCandidatos;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY, 
    email varchar(255) not null unique,
    nome VARCHAR(255) NOT NULL, 
    senha VARCHAR(255) NOT NULL     
);

CREATE TABLE Candidato (
    cand_cpf VARCHAR(11) PRIMARY KEY,
    cand_nome VARCHAR(255) NOT NULL,
    cand_endereco VARCHAR(255) NOT NULL,
    cand_telefone VARCHAR(20) NOT NULL
);


CREATE TABLE Vaga (
    vaga_codigo INT AUTO_INCREMENT PRIMARY KEY,
    vaga_cargo VARCHAR(255) NOT NULL,
    vaga_salario DECIMAL(10, 2) NOT NULL,
    vaga_cidade VARCHAR(255) NOT NULL,
    vaga_quantidade INT NOT NULL
);

CREATE TABLE Candidato_Vaga (
    cand_cpf VARCHAR(11),
    vaga_codigo INT,
    data_inscricao DATE NOT NULL,
    horario_inscricao TIME NOT NULL,
    PRIMARY KEY (cand_cpf, vaga_codigo),
    FOREIGN KEY (cand_cpf) REFERENCES Candidato(cand_cpf),
    FOREIGN KEY (vaga_codigo) REFERENCES Vaga(vaga_codigo)
);

select * from candidato;
select * from vaga;
select * from Candidato_Vaga;



