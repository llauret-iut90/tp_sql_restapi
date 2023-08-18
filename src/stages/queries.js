// 1 - Liste des entreprises
const getEntreprises = 'SELECT * FROM ENTREPRISE';
// 2 - Liste des professeurs assistants ayant participé à au moins n soutenances
const getListeProfAssistants = `
    SELECT PROFESSEUR.noProfesseur,
           PROFESSEUR.nomProfesseur,
           COUNT(DISTINCT SECOMPOSE.idJury) AS "Nombre de soutenances"
    FROM PROFESSEUR
             INNER JOIN
         SECOMPOSE ON PROFESSEUR.noProfesseur = SECOMPOSE.noProfesseur
    GROUP BY PROFESSEUR.noProfesseur,
             PROFESSEUR.nomProfesseur
    HAVING COUNT(DISTINCT SECOMPOSE.idJury) >= $1
`;
// 3 - Ajouter une entreprise
const addEntreprise = 'INSERT INTO ENTREPRISE (nomEntreprise) VALUES ($1)';
const checkEntrepriseExists = 'SELECT e FROM ENTREPRISE e WHERE e.nomEntreprise = $1';
// 4 - Ajouter un professeur
const addProfesseur = 'INSERT INTO PROFESSEUR (nomProfesseur) VALUES ($1)';
const checkProfesseurExists = 'SELECT p FROM PROFESSEUR p WHERE p.nomProfesseur = $1';
// 5 - Ajouter un jury
const addJury = 'INSERT INTO JURY (nomJury, idSalle) VALUES ($1, $2)';
const checkIdSalleExists = 'SELECT s FROM SALLE s INNER JOIN JURY on JURY.idSalle = S.idSalle WHERE s.idSalle = $1';
// 6 - Ajouter une soutenance
// j'ajoute un étudiant avant de l'ajouter à une soutenance (ça marche pas pour l'instant à cause de tuteur présent)
const addEtudiant = 'INSERT INTO ETUDIANT (noEtudiant, nomEtu, tuteurPresent, idEntreprise, idProfesseur) VALUES ($1, $2, $3, $4)';
const checkEtudiantExists = 'SELECT e FROM ETUDIANT e WHERE e.noEtudiant = $1';
//----------------- Ajout de soutenance -----------------// (ça marche pas pour l'instant à cause de noEtudiant)
const addSoutenance = 'INSERT INTO SOUTIENT (noEtudiant, idJury, dateSout, note) VALUES ($1, $2, $3, $4)'
const checkJuryExists = 'SELECT j FROM JURY j WHERE j.idJury = $1';
const betweenNote = 'SELECT * FROM SOUTIENT WHERE note BETWEEN 0 AND 20';
// 7 Suppresion d'une entreprise
const deleteEntreprise = 'DELETE FROM ENTREPRISE WHERE idEntreprise = $1';
const checkLinkEtuEntreprise = 'SELECT * FROM ETUDIANT INNER JOIN ENTREPRISE on ENTREPRISE.idEntreprise = ETUDIANT.idEntreprise';

module.exports = {
    getEntreprises,
    getListeProfAssistants,
    addEntreprise,
    checkEntrepriseExists,
    addProfesseur,
    checkProfesseurExists,
    addJury,
    checkIdSalleExists,
    addEtudiant,
    addSoutenance,
    checkEtudiantExists,
    checkJuryExists,
    betweenNote,
    deleteEntreprise,
    checkLinkEtuEntreprise
};