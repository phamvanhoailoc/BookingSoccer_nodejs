import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);
let createNewUser = async(data) =>{
    return new Promise( async(resolve, reject)=>{
        try{
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.sexId ==='1' ? true : false,
                roleId: data.roleId,
                phonenumber: data.phonenumber
            })
            resolve('ok create a new user succes');

        }catch(e){
            reject(e);
        }
    })
}

let hashUserPassword = (password)=>{
    return new Promise( async(resolve, reject)=>{
        try{
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        }catch(e){
            reject(e);
        }
    })
}

let getAllUser = () => {
    return new Promise((resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users);
        }catch(e) {
            reject(e);
        }
    })
}

let getUserInfobyId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId},
                raw: true,
            });
            if(user){
                resolve(user);
            }else{
                resolve([]);

            }
        }catch(e) {
            reject(e);
        }
    })
    
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: data.id}
            })
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();

                let allUsers = await db.User.findAll();
                resolve(allUsers);
            }else{
                resolve();
            }
            
        }catch(e) {
            reject(e);
        }
    })
}

let deleteUserById = (userId) =>{
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId},
            });
            if(user){
                await user.destroy();
            }
            resolve();
        }catch(e) {
            reject(e);
        }
    })
}

module.exports ={
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfobyId: getUserInfobyId,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
}