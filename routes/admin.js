const express = require('express');
const router = express.Router();
const cityController = require('../controllers/admin/cityController');
const systemOfMedicineController = require('../controllers/admin/systemOfMedicineController');
const treatmentController = require('../controllers/admin/trreatmentController');
const treatmentCategoryController = require('../controllers/admin/treatmentCategoryController');
const specializationController = require('../controllers/admin/specializationController');
const moduleController = require('../controllers/admin/moduleController');
const rolesController = require('../controllers/admin/rolesController');
const { auth } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');

// routes

module.exports = router;

router.get('/city/getAll', auth, admin, cityController.getAll)
router.post('/city/addNewCity', auth, admin, cityController.addNewCity)
router.put('/city/updateCity/:id', auth, admin, cityController.updateCity)
router.post('/city/bulkAddCity', auth, admin, cityController.bulkAddCity)
router.delete('/city/removeCity/:id', auth, admin, cityController.removeCity)

router.get('/systemOfMedicine/getAll', auth, admin, systemOfMedicineController.getAll)
router.put('/systemOfMedicine/updateSystemOfMedicine/:id', auth, admin, systemOfMedicineController.updateSystemOfMedicine)
router.post('/systemOfMedicine/addNewSystemOfMedicine', auth, admin, systemOfMedicineController.addNewSystemOfMedicine)
router.delete('/systemOfMedicine/removeSystemOfMedicine/:id', auth, admin, systemOfMedicineController.removeSystemOfMedicine)

router.get('/treatmentcategory/getAllTreatmentCategories', auth, admin, treatmentCategoryController.getAllTreatmentCategories)
router.post('/treatmentcategory/addNewTreatmentCategory', auth, admin, treatmentCategoryController.addNewTreatmentCategory)
router.put('/treatmentcategory/updateTreatmentCategory/:id', auth, admin, treatmentCategoryController.updateTreatmentCategory)
router.delete('/treatmentcategory/removeTreatmentCategory/:id', auth, admin, treatmentCategoryController.removeTreatmentCategory)

router.get('/treatment/getAllTreatments', auth, admin, treatmentController.getAllTreatments)
router.post('/treatment/addNewTreatment', auth, admin, treatmentController.addNewTreatment)
router.put('/treatment/updateTreatment/:id', auth, admin, treatmentController.updateTreatment)
router.post('/treatment/bulkAddTreatments', auth, admin, treatmentController.bulkAddTreatments)
router.delete('/treatment/removeTreatment/:id', auth, admin, treatmentController.removeTreatment)


router.get('/specialization/getAllSpecializations', auth, admin, specializationController.getAllSpecializations)
router.post('/specialization/addNewSpecialization', auth, admin, specializationController.addNewSpecialization)
router.put('/specialization/updateSpecialization/:id', auth, admin, specializationController.updateSpecialization)
router.post('/specialization/bulkAddSpecializations', auth, admin, specializationController.bulkAddSpecializations)
router.delete('/specialization/removeSpecialization/:id', auth, admin, specializationController.removeSpecialization)


router.get('/module/getAllModules', auth, admin, moduleController.getAllModules)
router.post('/module/addNewModule', auth, admin, moduleController.addNewModule)
router.put('/module/updateModule/:id', auth, admin, moduleController.updateModule)
router.post('/module/bulkAddModules', auth, admin, moduleController.bulkAddModules)
router.delete('/module/removeModule/:id', auth, admin, moduleController.removeModule)


router.get('/role/getAllRoles', auth, admin, rolesController.getAll)
router.post('/role/addNewRole', auth, admin, rolesController.addNewRole)
router.put('/role/updateRole/:id', auth, admin, rolesController.updateRole)
router.post('/role/bulkAddRole', auth, admin, rolesController.bulkAddRole)
router.delete('/role/removeRole/:id', auth, admin, rolesController.removeRole)