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

router.get('/city/getAll', admin, cityController.getAll)
router.post('/city/addNewCity', admin, cityController.addNewCity)
router.put('/city/updateCity/:id', admin, cityController.updateCity)
router.post('/city/bulkAddCity', admin, cityController.bulkAddCity)
router.delete('/city/removeCity/:id', admin, cityController.removeCity)

router.get('/systemOfMedicine/getAll', admin, systemOfMedicineController.getAll)
router.put('/systemOfMedicine/updateSystemOfMedicine/:id', admin, systemOfMedicineController.updateSystemOfMedicine)
router.post('/systemOfMedicine/addNewSystemOfMedicine', admin, systemOfMedicineController.addNewSystemOfMedicine)
router.delete('/systemOfMedicine/removeSystemOfMedicine/:id', admin, systemOfMedicineController.removeSystemOfMedicine)

router.get('/treatmentcategory/getAllTreatmentCategories', admin, treatmentCategoryController.getAllTreatmentCategories)
router.post('/treatmentcategory/addNewTreatmentCategory', admin, treatmentCategoryController.addNewTreatmentCategory)
router.put('/treatmentcategory/updateTreatmentCategory/:id', admin, treatmentCategoryController.updateTreatmentCategory)
router.delete('/treatmentcategory/removeTreatmentCategory/:id', admin, treatmentCategoryController.removeTreatmentCategory)

router.get('/treatment/getAllTreatments', admin, treatmentController.getAllTreatments)
router.post('/treatment/addNewTreatment', admin, treatmentController.addNewTreatment)
router.put('/treatment/updateTreatment/:id', admin, treatmentController.updateTreatment)
router.post('/treatment/bulkAddTreatments', admin, treatmentController.bulkAddTreatments)
router.delete('/treatment/removeTreatment/:id', admin, treatmentController.removeTreatment)


router.get('/specialization/getAllSpecializations', admin, specializationController.getAllSpecializations)
router.post('/specialization/addNewSpecialization', admin, specializationController.addNewSpecialization)
router.put('/specialization/updateSpecialization/:id', admin, specializationController.updateSpecialization)
router.post('/specialization/bulkAddSpecializations', admin, specializationController.bulkAddSpecializations)
router.delete('/specialization/removeSpecialization/:id', admin, specializationController.removeSpecialization)


router.get('/module/getAllModules', admin, moduleController.getAllModules)
router.post('/module/addNewModule', admin, moduleController.addNewModule)
router.put('/module/updateModule/:id', admin, moduleController.updateModule)
router.post('/module/bulkAddModules', admin, moduleController.bulkAddModules)
router.delete('/module/removeModule/:id', admin, moduleController.removeModule)


router.get('/role/getAllRoles', admin, rolesController.getAll)
router.post('/role/addNewRole', admin, rolesController.addNewRole)
router.put('/role/updateRole/:id', admin, rolesController.updateRole)
router.post('/role/bulkAddRole', admin, rolesController.bulkAddRole)
router.delete('/role/removeRole/:id', admin, rolesController.removeRole)