import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;


let createNewClinic = async(data) =>{
    return new Promise( async(resolve, reject)=>{
        try{

            await db.Clinic.create({
                name: data.name,
                address: data.address,
                description: data.description,
                area: data.area,
                image: data.image,
            }) 
            resolve({
                errCode: 0,
                message: 'Create user success'
            });

        }catch(e){
            reject(e);
        }
    })
}

let createNewDetailClinic = async(data) =>{
    return new Promise( async(resolve, reject)=>{
        try{

            if(!data.action){
                resolve({
                    errCode:1,
                    errMessage:'Missing parameter!!!'
                })
            }else{
                if(data.action === 'CREATE'){
                    await db.Markdown.create({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        ClinicId: data.ClinicId
                    }) 
    
                }else if(data.action === 'EDIT'){
                    let clinicMarkdown = await db.Markdown.findOne({
                        where:{ClinicId: data.ClinicId},
                        raw:false,
                    })

                    if(clinicMarkdown){
                        clinicMarkdown.contentHTML= data.contentHTML;
                        clinicMarkdown.contentMarkdown= data.contentMarkdown;
                        clinicMarkdown.description= data.description;
                        clinicMarkdown.updatedAt = new Date();
                        await clinicMarkdown.save();
                    }
                }
    
                
                resolve({
                    errCode: 0,
                    message: 'Create user success'
                });
            }

           

        }catch(e){
            reject(e);
        }
    })
}

let bulkCreateSchedule = async(data) =>{
    return new Promise( async(resolve, reject)=>{
        try{

            if(!data.doctorId || !data.formatedDate){
                resolve({
                    errCode:1,
                    errMessage:'Missing parameter!!!'
                })
            }else{
                let schedule = data.arrSchedule;
                if(schedule && schedule.length > 0){
                    schedule = schedule.map(item =>{
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
    
                }
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate},
                    attributes: ['timeType','date', 'doctorId', 'maxNumber'],
                    raw: true
                });

                // if(existing && existing.length > 0){
                //     existing = existing.map(item =>{
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // }

                let toCreate = _.differenceWith(schedule, existing, (a,b) =>{
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                if(toCreate && toCreate.length > 0){
                    await db.Schedule.bulkCreate(toCreate);
                }
    
                
                resolve({
                    errCode: 0,
                    message: 'Create user success'
                });
            }

           

        }catch(e){
            reject(e);
        }
    })
}

let sendRemedy = async(data) =>{
    return new Promise( async(resolve, reject)=>{
        try{
            if(!data.email || !data.doctorId || !data.patientId || !data.timeType){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }else{
                let appointment = await db.Booking.findOne({
                    where:{
                        doctorId: data.doctorId, 
                        patientId: data.patientId, 
                        timeType: data.timeType, 
                        statusId: 'S2'
                    },
                    raw: false
                })
                if(appointment){
                    appointment.statusId = 'S3';
                    await appointment.save();
                }

                await emailService.sendAttachment(data);

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
            

           

        }catch(e){
            reject(e);
        }
    })
}



let getAllClinic = async(clinicId) =>{
    return new Promise( async(resolve, reject)=>{
        try{

            let clinics = '';
            if(clinicId == 'ALL'){
                clinics = await db.Clinic.findAll({
                })
            }
            if(clinicId && clinicId !== 'ALL'){
                clinics = await db.Clinic.findOne({
                    where: {id: clinicId}
                
                })
            }
            resolve(clinics);

        }catch(e){
            reject(e);
        }
    })
}




let getAllDetailClinic = async(inputId) =>{
    return new Promise( async(resolve, reject)=>{
        try{
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter!'
                })
            }else{
                let data = await db.Clinic.findOne({
                    where:{
                        id: inputId,
                    },
                    attributes:{
                        
                    },
                    include:[
                        {
                            model: db.Markdown,
                            attributes:['description','contentHTML','contentMarkdown']
                        },
                        {model: db.Allcode, as:'areaData',attributes:['valueEn','valueVi']},
                    ],
                    raw: false,
                    nest:true,
                })
                if(data && data.image){
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if(!data)data={};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
           

        }catch(e){
            reject(e);
        }
    })
}

let getTopClinicHome = async(limitInput) =>{
    return new Promise( async(resolve, reject)=>{
        try{

            let clinics = await db.Clinic.findAll({
                limit: limitInput,
                where: {area: 'Q5'},
                order:[['createdAt', 'DESC']],
               
                include:[
                    {model: db.Allcode, as:'areaData', attribute: ['valueEn','valueVi']}
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode:0,
                data: clinics
            });

        }catch(e){
            reject(e);
        }
    })
}

let getScheduleByDate = async(doctorId, date) =>{
    return new Promise( async(resolve, reject)=>{
        try{
            
            if(!doctorId || !date ){
                resolve({
                    errCode:1,
                    errMessage:'Missing parameter!!!'
                })
            }else{
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId:doctorId, 
                        date: date
                    },
                    include:[
                        {model: db.Allcode, as: 'timeTypeData', attributes:['valueEn','valueVi']},
                        {model: db.Clinic, as: 'doctorData', attributes:['name']},
                    ],
                    raw: false,
                    nest: true
                })
                if(!dataSchedule) dataSchedule = [];

                resolve({
                    errCode:0,
                    data:dataSchedule
                })
            }
            

        }catch(e){
            reject(e);
        }
    })
}

let getListPatientForDoctor = async(doctorId, date) =>{
    return new Promise( async(resolve, reject)=>{
        try{
            
            if(!doctorId || !date ){
                resolve({
                    errCode:1,
                    errMessage:'Missing parameter!!!'
                })
            }else{
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId:doctorId,
                        date: date
                    },
                    include:[
                        {
                            model: db.User, as: 'patientData',
                            attributes:['email','firstName','address','gender'],
                            include:[
                                {
                                    model: db.Allcode, as: 'genderData', attributes:['valueEn','valueVi']
                                }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes:['valueEn','valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode:0,
                    data: data
                })
            }
            

        }catch(e){
            reject(e);
        }
    })
}




let updateClinicData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {

            if(!data.id){
                resolve({
                    errCode: 2,
                    errMessage:'Missing required parameters'
                })
            }
            let clinic = await db.Clinic.findOne({
                where: {id: data.id},
                raw: false
            })
            if(clinic){
                clinic.name = data.name;
                clinic.address = data.address;
                clinic.description = data.description;
                clinic.area = data.area;
                if(data.image){
                    clinic.image = data.image;
                }
                await clinic.save();

                resolve({
                    errCode: 0,
                    message: 'Update user success'
                })
            }else{
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`
                });
            }
            
        }catch(e) {
            reject(e);
        }
    })
}

let deleteClinic = (Id) =>{
    return new Promise(async (resolve, reject) => {
            let clinic = await db.Clinic.findOne({
                where: {id: Id},
            });
            if(!clinic){
                resolve({
                    errCode: 2,
                    message: `The user isn't exist`
                })
            }
            await db.Clinic.destroy({
                where: {id: Id},
            })

            resolve({
                errCode: 0,
                message: 'delete user success'
            })
    })
}

module.exports ={
    createNewClinic: createNewClinic,
    getAllClinic: getAllClinic,
    updateClinicData: updateClinicData,
    deleteClinic: deleteClinic,
    getTopClinicHome: getTopClinicHome,
    createNewDetailClinic: createNewDetailClinic,
    getAllDetailClinic: getAllDetailClinic,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
}