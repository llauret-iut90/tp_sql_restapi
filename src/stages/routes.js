const {Router} = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', controller.getEntreprises);
router.get('/:n', controller.getListeProfAssistants);
router.post('/', controller.addEntreprise);
router.post('/prof', controller.addProfesseur);
router.post('/jury', controller.addJury);
router.post('/etudiant', controller.addEtudiant);
router.post('/soutenance', controller.addSoutenance);
router.delete('/:n', controller.deleteEntreprise);

module.exports = router;