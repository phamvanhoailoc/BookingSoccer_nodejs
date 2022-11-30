import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from './emailService';
import {v4 as uuidv4} from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postBookAppointment = async(data) =>{
    return new Promise( async(resolve, reject)=>{
        try{

            if(!data.email || !data.doctorId || !data.timeType ){
                resolve({
                    errCode: 1,
                    message: 'Missing parameters'
                });
            }else{
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time:data.timeString,
                    doctorName: data.doctorName,
                    language:data.language,
                    redirectLink:buildUrlEmail(data.doctorId, token)
                })

                let user = await db.User.findOrCreate({
                    where: {email: data.email},
                    defaults:{
                        email: data.email,
                        roleId: 'R3',
                        gender: data.gender,
                        address: data.address,
                        firstName: data.fullName
                    },
                });


                if(user && user[0]){
                    await db.Booking.findOrCreate({
                        where: {patientId: user[0].id},
                        defaults:{
                            statusId: 'S1',
                            doctorId: data.doctorId, 
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }

            }
            resolve({
                errCode: 0,
                message: 'Create user success'
            });

        }catch(e){
            reject(e);
        }
    })
}


let postverifyBookAppointment = async(data) =>{
    return new Promise( async(resolve, reject)=>{
        try{
            if(!data.token || !data.doctorId){
                resolve({
                    errCode: 1,
                    message: 'Missing parameter'
                });
            }else{
                let appointment = await db.Booking.findOne({
                    where:{
                        doctorId: data.doctorId, 
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if(appointment){
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        message: 'Update the appointment success'
                    })
                }else{
                    resolve({
                        errCode: 2,
                        message: 'appointment has been activated or does not exist'
                    })
                }

            }  

        }catch(e){
            reject(e);
        }
    })
}


module.exports ={
    postBookAppointment: postBookAppointment,
    postverifyBookAppointment: postverifyBookAppointment,
}