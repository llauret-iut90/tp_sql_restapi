DROP TABLE IF EXISTS SOUTIENT;
DROP TABLE IF EXISTS SECOMPOSE;
DROP TABLE IF EXISTS JURY;
DROP TABLE IF EXISTS ETUDIANT;
DROP TABLE IF EXISTS SALLE;
DROP TABLE IF EXISTS PROFESSEUR;
DROP TABLE IF EXISTS ENTREPRISE;

CREATE TABLE ENTREPRISE
(
    idEntreprise  serial PRIMARY KEY,
    nomEntreprise varchar(30)
);

CREATE TABLE PROFESSEUR
(
    noProfesseur  serial PRIMARY KEY,
    nomProfesseur varchar(30) NOT NULL
);

CREATE TABLE SALLE
(
    idSalle  serial PRIMARY KEY,
    nomSalle varchar(30) NOT NULL
);

CREATE TABLE ETUDIANT
(
    noEtudiant    serial PRIMARY KEY,
    nomEtu        varchar(30)                                          NOT NULL,
    tuteurPresent int CHECK ( tuteurPresent = 0 OR tuteurPresent = 1 ) NOT NULL,
    idEntreprise  int                                                  NOT NULL,
    idProfesseur  int                                                  NOT NULL,
    FOREIGN KEY (idEntreprise) REFERENCES ENTREPRISE (idEntreprise),
    FOREIGN KEY (idProfesseur) REFERENCES PROFESSEUR (noProfesseur)
);

CREATE TABLE JURY
(
    idJury  serial PRIMARY KEY,
    nomJury varchar(30) NOT NULL,
    idSalle int         NOT NULL,
    FOREIGN KEY (idSalle) REFERENCES SALLE (idSalle)
);

CREATE TABLE SECOMPOSE
(
    idJury       serial,
    noProfesseur serial,
    PRIMARY KEY (idJury, noProfesseur),
    FOREIGN KEY (idJury) REFERENCES JURY (idJury),
    FOREIGN KEY (noProfesseur) REFERENCES PROFESSEUR (noProfesseur)
);

CREATE TABLE SOUTIENT
(
    noEtudiant serial,
    idJury     serial,
    dateSout   timestamp NOT NULL,
    note       float     NOT NULL,
    PRIMARY KEY (noEtudiant, idJury),
    FOREIGN KEY (noEtudiant) REFERENCES ETUDIANT (noEtudiant),
    FOREIGN KEY (idJury) REFERENCES JURY (idJury)
);

insert into entreprise
values (default, 'Google');
insert into entreprise
values (default, 'PSA');
insert into entreprise
values (default, 'Apple');
insert into entreprise
values (default, 'IBM');


insert into professeur
values (default, 'Ambert');
insert into professeur
values (default, 'Couchot');
insert into professeur
values (default, 'Couturier');
insert into professeur
values (default, 'Domas');



insert into salle
values (default, '101');
insert into salle
values (default, '102');
insert into salle
values (default, '105');
insert into salle
values (default, '108');


insert into jury
values (default, 'jury1', 1);
insert into jury
values (default, 'jury2', 2);
insert into jury
values (default, 'jury3', 3);
insert into jury
values (default, 'jury4', 1);


insert into etudiant
values (default, 'toto', 1, 1, 1);
insert into etudiant
values (default, 'etudiant2', 1, 1, 1);
insert into etudiant
values (default, 'etudiant3', 0, 2, 2);
insert into etudiant
values (default, 'etudiant4', 0, 3, 2);
insert into etudiant
values (default, 'etudiant5', 1, 4, 2);
insert into etudiant
values (default, 'etudiant6', 0, 2, 3);
insert into etudiant
values (default, 'etudiant7', 1, 4, 4);
insert into etudiant
values (default, 'etudiant8', 1, 1, 3);


insert into secompose
values (1, 1);
insert into secompose
values (1, 2);
insert into secompose
values (2, 3);
insert into secompose
values (2, 4);
insert into secompose
values (3, 1);
insert into secompose
values (3, 4);
insert into secompose
values (4, 2);
insert into secompose
values (4, 3);

insert into soutient
values (1, 1, '06/06/2020', 12.0);
insert into soutient
values (2, 2, '06/06/2020', 16.0);
insert into soutient
values (3, 2, '06/06/2020', 12.0);
insert into soutient
values (4, 1, '06/06/2020', 8.0);
insert into soutient
values (5, 3, '07/06/2020', 13.0);
insert into soutient
values (6, 4, '07/06/2020', 10.0);
insert into soutient
values (7, 3, '07/06/2020', 12.0);
insert into soutient
values (8, 3, '07/06/2020', 15.0);

-- ETUDIANT(noEtudiant,nomEtu,tuteurPresent,idEntreprise*, noProfesseur*)
--  ENTREPRISE(idEntreprise, nomEntreprise)
--  PROFESSEUR(noProfesseur, nomProfesseur)
--  JURY(idJury, nomJury, idSalle*)
--  SALLE(idSalle, nomSalle)
--  SECOMPOSE(idJury*,noProfesseur*)
--  SOUTIENT(noEtudiant*,idJury*,dateSout,note)


-- RQ1 Professeur responsable de l'étudiant toto
SELECT PROFESSEUR.nomProfesseur
FROM PROFESSEUR
         INNER JOIN ETUDIANT E on PROFESSEUR.noProfesseur = E.idProfesseur
WHERE E.nomETU = 'toto';

-- RQ2 Nombre de professeur ayant participé à au moins un jury.
SELECT COUNT(DISTINCT noProfesseur)
FROM SECOMPOSE;

-- RQ3 Membre(s) du jury de l’étudiant ‘toto’ (affichage : nomProfesseur)
SELECT PROFESSEUR.nomProfesseur AS "Membre(s) du jury"
FROM PROFESSEUR
         INNER JOIN SECOMPOSE S on PROFESSEUR.noProfesseur = S.noProfesseur
         INNER JOIN SOUTIENT ON S.idJury = SOUTIENT.idJury
         INNER JOIN ETUDIANT E on SOUTIENT.noEtudiant = E.noEtudiant
WHERE E.nomETU = 'toto'
GROUP BY PROFESSEUR.nomProfesseur;

-- RQ4 Liste des étudiant(s) ayant eu la même note que l’étudiant ‘toto’ (affichage : nomEtudiant)
SELECT ETUDIANT.nomEtu
FROM ETUDIANT
         INNER JOIN SOUTIENT S on ETUDIANT.noEtudiant = S.noEtudiant
WHERE S.note = 12;

-- Si on ne connaît pas la note de toto
SELECT ETUDIANT.nomEtu
FROM ETUDIANT
         INNER JOIN SOUTIENT S on ETUDIANT.noEtudiant = S.noEtudiant
WHERE S.note = (SELECT S2.note
                FROM ETUDIANT E2
                         INNER JOIN SOUTIENT S2 on E2.noEtudiant = S2.noEtudiant
                WHERE E2.nometu = 'toto');


-- RQ5 Professeur(s) devant assister à plus de 5 soutenances (Affichage :noProfesseur + nomProfesseur + nombre de soutenances)
SELECT PROFESSEUR.noProfesseur, PROFESSEUR.nomProfesseur, COUNT(DISTINCT SECOMPOSE.idJury) AS "Nombre de soutenances"
FROM PROFESSEUR
         INNER JOIN SECOMPOSE ON PROFESSEUR.noProfesseur = SECOMPOSE.noProfesseur
GROUP BY PROFESSEUR.noProfesseur, PROFESSEUR.nomProfesseur
HAVING COUNT(DISTINCT SECOMPOSE.idJury) > 1;


-- RQ6 Planning des soutenances (affichage : nomEtudiant + nomSalle + nom du professeur responsable du stage + date de soutenance + nomEntreprise)
SELECT ETUDIANT.nomEtu, SALLE.nomsalle, PROFESSEUR.nomProfesseur, SOUTIENT.datesout, ENTREPRISE.nomentreprise
FROM ETUDIANT
         INNER JOIN ENTREPRISE on ENTREPRISE.idEntreprise = ETUDIANT.idEntreprise
         INNER JOIN PROFESSEUR on PROFESSEUR.noProfesseur = ETUDIANT.idProfesseur
         INNER JOIN SOUTIENT on ETUDIANT.noEtudiant = SOUTIENT.noEtudiant
         INNER JOIN JURY on SOUTIENT.idJury = JURY.idJury
         INNER JOIN SECOMPOSE on PROFESSEUR.noProfesseur = SECOMPOSE.noProfesseur
         INNER JOIN SALLE on JURY.idSalle = SALLE.idSalle
GROUP BY ETUDIANT.nomEtu, SALLE.nomsalle, PROFESSEUR.nomProfesseur, SOUTIENT.datesout, ENTREPRISE.nomentreprise
ORDER BY ETUDIANT.nomETU;

-- RQ7 Nombre de soutenances avec tuteur entreprise présent par salle (Affichage :noSalle + nomSalle + nombre de soutenances)
SELECT SALLE.idsalle, SALLE.nomSalle, COUNT(DISTINCT SECOMPOSE.idJury) AS "Nombre de soutenances"
FROM SALLE
         INNER JOIN JURY on SALLE.idSalle = JURY.idSalle
         INNER JOIN SECOMPOSE on JURY.idJury = SECOMPOSE.idJury
         INNER JOIN PROFESSEUR on SECOMPOSE.noProfesseur = PROFESSEUR.noProfesseur
group by SALLE.nomSalle, SALLE.idsalle
ORDER BY SALLE.idSalle;

SELECT *
FROM JURY;
SELECT *
FROM ETUDIANT;
SELECT *
FROM SECOMPOSE;
SELECT *
FROM PROFESSEUR;
SELECT *
FROM SOUTIENT;
SELECT *
FROM SALLE;
SELECT *
FROM ENTREPRISE;