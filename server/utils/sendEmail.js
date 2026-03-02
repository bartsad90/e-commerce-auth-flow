const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodemailerConfig')

const transporter = nodemailer.createTransport(nodemailerConfig)

const sendEmail = async ({to, subject, html}) => {

  const emailData = {
    user: 'timmothy.jerde@ethereal.email',
    from: "Timmy Jerde <timmothy.jerde@ethereal.email>",
    to,
    subject,
    html,
  }

  let info = await transporter.sendMail(emailData)

  console.log(emailData)
  return info
}

module.exports = sendEmail