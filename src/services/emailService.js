import db from '../models/index';
require('dotenv').config();
const nodemailer = require("nodemailer");



let sendSimpleEmail = async (dataSend) => {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Phạm Văn Hoài Lộc" <phamvanhoailoc0507@gmail.com>', // sender address
    to: dataSend.reciverEmail, // list of receivers
    subject: "Thông tin đặt sân bóng", // Subject line
    text: "Hello world?", // plain text body
    html: getBodyHTMLEmail(dataSend),
  });

}

let getBodyHTMLEmail = (dataSend) => {
  let result = '';
  if (dataSend.language === 'vi') {
    result =
      `
    <h3>Xin chào ${dataSend.patientName}</h3>
    <p>Bạn nhận được thông tin này vì bạn đã đặt sân online trên BookingSoccer</p>
    <p>Thông tin đặt sân :</p>
    <div><p>Thời gian: ${dataSend.time}</p></div>
    <div><p>Địa điểm: ${dataSend.doctorName}</p></div>

    <p>Nếu thông trên là đúng sự thật, vui lòng click vào đường link để hoàn tất quá trình đặt sân</p>
    <div><a href=${dataSend.redirectLink} target="blank">Click here</a></div>

    <div>Xin chân thành cảm ơn</div>
  ` // html body
  }
  if (dataSend.language === 'en') {
    result =
      `
    <h3>Hi ${dataSend.patientName}</h3>
    <p>You received this information because you booked the course online on BookingSoccer</p>
    <p>Yard booking information:</p>
    <div><p>Time: ${dataSend.time}</p></div>
    <div><p>Where: ${dataSend.doctorName}</p></div>

    <p>If the above information is correct, please click on the link to complete the booking process</p>
    <div><a href=${dataSend.redirectLink} target="blank">Click here</a></div>

    <div>Sincerely thank</div>
  ` // html body
  }
  return result;
}

let sendAttachment = async (dataSend) => {


  return new Promise(async (resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Phạm Văn Hoài Lộc" <phamvanhoailoc0507@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Hóa đơn ", // Subject line
        text: "Hello world?", // plain text body
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [{
          filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
          content: dataSend.imgBase64.split("base64,")[1],
          encoding: 'base64'
        }]
      });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  })


}

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = '';
  if (dataSend.language === 'vi') {
    result =
      `
    <h3>Xin chào ${dataSend.patientName}</h3>
    <p>Bạn nhận được thông tin này vì bạn đã đặt sân online trên BookingSoccer</p>
    <p>Thông tin hóa đơn :</p>

    <div>Xin chân thành cảm ơn</div>
  ` // html body
  }
  if (dataSend.language === 'en') {
    result =
      `
    <h3>Hi ${dataSend.patientName}</h3>
    <p>You received this information because you booked the course online on BookingSoccer</p>
    <p>Receipt information:</p>

    <div>Sincerely thank</div>
  ` // html body
  }
  return result;
}



module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment,
}