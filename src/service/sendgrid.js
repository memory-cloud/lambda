// const sgMail = require('@sendgrid/mail')
//
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//
// const sendVerificationEmail = async function ({ email, verification }) {
//   msg.to = email
//   msg.text = `confirmation link: https://memorycloud.herokuapp.com/?query=query{confirm(email:%22${email}%22confirmation:%22${verification}%22)}`
//   msg.html = `confirmation link: <a href="https://memorycloud.herokuapp.com/?query=query{confirm(email:%22${email}%22confirmation:%22${verification}%22)}">click here</a>`
//   return sgMail.send(msg)
// }
//
// const msg = {
//   to: '',
//   from: 'memorycloud@memorycloud.com',
//   subject: 'Email verification',
//   text: '',
//   html: ''
// }
//
// module.exports = sendVerificationEmail
