import { query } from "express";
import patientService from "../services/patientService";

let  postBookAppointment = async (req, res) => {

    try{
        let message = await patientService.postBookAppointment(req.body);
        return res.status(200).json(message);
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }

    
}


let  postverifyBookAppointment = async (req, res) => {

    try{
        let message = await patientService.postverifyBookAppointment(req.body);
        return res.status(200).json(message);
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }

    
}



module.exports = {
    postBookAppointment: postBookAppointment,
    postverifyBookAppointment: postverifyBookAppointment,

}