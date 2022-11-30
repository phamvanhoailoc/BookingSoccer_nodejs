import { query } from "express";
import clinicService from "../services/clinicService";

let  handleCreateNewClinics = async (req, res) => {
    let message = await clinicService.createNewClinic(req.body);
    return res.status(200).json(message);
}

let  handleCreateNewDetailClinics = async (req, res) => {
    let message = await clinicService.createNewDetailClinic(req.body);
    return res.status(200).json(message);
}

let  bulkCreateSchedule = async (req, res) => {

    try{
        let message = await clinicService.bulkCreateSchedule(req.body);
        return res.status(200).json(message);
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
    
}


let  handleGetAllClinics = async (req, res) => {
    let id = req.query.id;
    if(!id){
        return res.status(200).json({
            errCode: 1,
            errMessage:'Missing required parameters',
            clinics:[]
        })
    }
    let clinics = await clinicService.getAllClinic(id);
    return res.status(200).json({
        errCode: 0,
        errMessage:'Ok',
        clinics
    })
}

let  getScheduleByDate = async (req, res) => {
    try{
        let infor = await clinicService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(
            infor
        )
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage:'Error from the server',
            clinics
        })
    }
    
    
}





let  getDetailClinics = async (req, res) => {
    try{
        let infor = await clinicService.getAllDetailClinic(req.query.id);
        return res.status(200).json(
            infor
        )
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage:'Error from the server'
        })
    }
}

let handleEditClinics = async (req, res) => {
    let data = req.body;
    let message = await clinicService.updateClinicData(data);
    return res.status(200).json(message);
}

let handleDeleteClinics = async (req, res) => {
    if(!req.body.id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        })
    }
    let message = await clinicService.deleteClinic(req.body.id);
    return res.status(200).json(message);
}

let  getTopClinicHome = async (req, res) => {
    let limit = req.query.limit;
    if(!limit) limit = 10;
    try{
        let response = await clinicService.getTopClinicHome(+limit);
        return res.status(200).json(response)
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
        
}


let  getListPatientForDoctor = async (req, res) => {
    try{
        let infor = await clinicService.getListPatientForDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(
            infor
        )
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage:'Error from the server'
        })
    }
}


let  sendRemedy = async (req, res) => {
    try{
        let infor = await clinicService.sendRemedy(req.body);
        return res.status(200).json(
            infor
        )
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage:'Error from the server'
        })
    }
}




module.exports = {

    handleCreateNewClinics: handleCreateNewClinics,
    handleGetAllClinics: handleGetAllClinics,
    handleEditClinics: handleEditClinics,
    handleDeleteClinics: handleDeleteClinics,
    getTopClinicHome: getTopClinicHome,
    handleCreateNewDetailClinics: handleCreateNewDetailClinics,
    getDetailClinics: getDetailClinics,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getListPatientForDoctor : getListPatientForDoctor,
    sendRemedy: sendRemedy,
}