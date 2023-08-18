const pool = require("../../db");
const queries = require("./queries");


const getEntreprises = (req, res) => {
    pool.query(queries.getEntreprises, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getListeProfAssistants = (req, res) => {
    const n = parseInt(req.params.n);
    pool.query(queries.getListeProfAssistants, [n], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const addEntreprise = (req, res) => {
    const {nomEntreprise} = req.body; // objet destructuring
    pool.query(queries.checkEntrepriseExists, [nomEntreprise], (error, results) => {
        if (results.rows.length) res.send("L'entreprise existe déjà");
        else {
            pool.query(queries.addEntreprise, [nomEntreprise], (error, results) => {
                if (error) throw error;
                res.status(201).send('Entreprise ajoutée! \n [' + nomEntreprise + ']\n');
            });
        }
    });
}

const addProfesseur = (req, res) => {
    const {nomProfesseur} = req.body; // objet destructuring
    pool.query(queries.checkProfesseurExists, [nomProfesseur], (error, results) => {
        if (results.rows.length) res.send("Le professeur existe déjà");
        else {
            pool.query(queries.addProfesseur, [nomProfesseur], (error, results) => {
                if (error) throw error;
                res.status(201).send('Professeur ajouté! \n [' + nomProfesseur + ']\n');
            });
        }
    });
}

const addJury = (req, res) => {
    const {idSalle, nomJury} = req.body; // objet destructuring

    // Vérifier si l'idSalle existe dans la base de données
    pool.query(queries.checkIdSalleExists, [idSalle], (error, results) => {
        if (error) throw error;

        if (!results.rows.length) {
            res.send("La salle du Jury n'existe pas");
        } else {
            // L'idSalle existe, nous pouvons ajouter le jury
            pool.query(queries.addJury, [nomJury, idSalle], (error, results) => {
                if (error) throw error;
                res.status(201).send(`Jury ajouté!\n[nomJury: ${nomJury}, idSalle: ${idSalle}]`);
            });
        }
    });
}

const addEtudiant = (req, res) => {
    const {noEtudiant, nomEtu, tuteurPresent, idEntreprise, idProfesseur} = req.body; // objet destructuring
    pool.query(queries.checkEtudiantExists, [noEtudiant], (error, results) => {
        if (error) throw error;
        if (results.rows.length) {
            res.send("L'étudiant existe déjà avec cet id");
        }
        pool.query(!queries.checkEntrepriseExists, [idEntreprise], (error, results) => {
            if (error) throw error;
            if (!results.rows.length) {
                res.send("L'entreprise n'existe pas");
            }
            pool.query(!queries.checkProfesseurExists, [idProfesseur], (error, results) => {
                if (error) throw error;
                if (!results.rows.length) {
                    res.send("Le professeur n'existe pas");
                }
                pool.query(queries.addEtudiant, [noEtudiant, nomEtu, tuteurPresent, idEntreprise, idProfesseur], (error, results) => {
                    if (error) throw error;
                    res.status(201).send(`Etudiant ajouté!\n[noEtudiant: ${noEtudiant}, nomEtu: ${nomEtu}, tuteurPresent: ${tuteurPresent}, idEntreprise: ${idEntreprise}, idProfesseur: ${idProfesseur}]`);
                });
            });
        });
    });
}

const addSoutenance = (req, res) => {
    const {noEtudiant, idJury, dateSout, note} = req.body; // objet destructuring

    const handleSoutenanceError = (errorMessage) => {
        res.send(errorMessage);
    };

    const checkAndAddSoutenance = () => {
        pool.query(queries.checkJuryExists, [idJury], (error, juryResults) => {
            if (error) throw error;

            if (!juryResults.rows.length) {
                handleSoutenanceError("Le jury n'existe pas");
            } else {
                pool.query(queries.checkEtudiantExists, [noEtudiant], (error, etudiantResults) => {
                    if (error) throw error;

                    if (!etudiantResults.rows.length) {
                        handleSoutenanceError("L'étudiant n'existe pas");
                    } else {
                        pool.query(queries.betweenNote, (error, soutenanceResults) => {
                            if (error) throw error;

                            if (!soutenanceResults.rows.length) {
                                handleSoutenanceError("La note doit être entre 0 et 20");
                            } else {
                                performAddSoutenance();
                            }
                        });
                    }
                });
            }
        });
    };

    const performAddSoutenance = () => {
        pool.query(queries.addSoutenance, [noEtudiant, idJury, dateSout, note], (error, results) => {
            if (error) throw error;
            res.status(201).send(`Soutenance ajoutée!\n[noEtudiant: ${noEtudiant}, idJury: ${idJury}, dateSout: ${dateSout}, note: ${note}]`);
        });
    };
    checkAndAddSoutenance();
};

const deleteEntreprise = (req, res) => {
    const n = parseInt(req.params.n);
    pool.query(queries.checkEntrepriseExists, [n], (error, results) => {
        if (error) throw error;
        if (!results.rows.length) {
            res.send("L'entreprise n'existe pas");
        }
        pool.query(queries.checkLinkEtuEntreprise, (error, results) => {
            if (error) throw error;
            if (results.rows.length) {
                res.send("L'entreprise est liée à un étudiant");
            }
            pool.query(queries.deleteEntreprise, [n], (error, results) => {
                if (error) throw error;
                res.status(200).send(`Entreprise supprimée!\n[idEntreprise: ${n}]`);
            });
        });
    });
}


module.exports = {
    getEntreprises,
    getListeProfAssistants,
    addEntreprise,
    addProfesseur,
    addJury,
    addEtudiant,
    addSoutenance,
    deleteEntreprise,
}