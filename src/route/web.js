import express from 'express';
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import clinicController from "../controllers/clinicController";
import patientController from "../controllers/patientController";


let router = express.Router();
let initWebRoutes = (app) => {
    router.get('/',homeController.getHomePage);
    router.get('/crud',homeController.getCrud);
    router.post('/post-crud',homeController.postCRUD);
    router.get('/get-crud',homeController.displayGetCRUD);
    router.get('/edit-crud',homeController.getEditCRUD);
    router.post('/put-crud',homeController.putCRUD);
    router.get('/delete-crud',homeController.deleteCRUD);


    router.post('/api/login',userController.handleLogin);
    router.get('/api/get-all-users',userController.handleGetAllUsers);
    router.post('/api/create-new-user',userController.handleCreateNewUsers);
    router.put('/api/edit-user',userController.handleEditUsers);
    router.delete('/api/delete-user',userController.handleDeleteUsers);
    router.get('/api/allcode',userController.getAllCode);

    router.post('/api/create-new-clinic',clinicController.handleCreateNewClinics);
    router.get('/api/get-all-clinic',clinicController.handleGetAllClinics);
    router.put('/api/edit-clinic',clinicController.handleEditClinics);
    router.delete('/api/delete-clinic',clinicController.handleDeleteClinics);
    router.get('/api/top-clinic-home',clinicController.getTopClinicHome);
    router.post('/api/create-detail-clinic',clinicController.handleCreateNewDetailClinics);
    router.get('/api/get-detail-clinic',clinicController.getDetailClinics);
    router.post('/api/bulk-create-schedule',clinicController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date',clinicController.getScheduleByDate);
    router.get('/api/get-list-patient-for-doctor',clinicController.getListPatientForDoctor);
    router.post('/api/send-remedy',clinicController.sendRemedy);


    router.post('/api/patient-book-appointment',patientController.postBookAppointment);
    router.post('/api/verify-book-appointment',patientController.postverifyBookAppointment);
  




    return app.use("/",router);
}
module.exports = initWebRoutes;