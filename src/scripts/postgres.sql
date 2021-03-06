DROP TABLE IF EXISTS TB_HEROIS;
CREATE TABLE TB_HEROIS (
    ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
    NOME TEXT NOT NULL,
    PODER TEXT NOT NULL
)

--CREATE
INSERT INTO TB_HEROIS (NOME, PODER)
VALUES 
    ('Flash','Velocidade'),
    ('Aquaman','Marinho'),
    ('Batman','Perspicácia')

--READ
SELECT * FROM TB_HEROIS;
SELECT nome FROM TB_HEROIS WHERE NOME='Flash';

--UPDATE
UPDATE TB_HEROIS
SET NOME='Goku', PODER='KI-Super Sayajin'
WHERE ID='1';

--DELETE
DELETE FROM TB_HEROIS WHERE ID=2;