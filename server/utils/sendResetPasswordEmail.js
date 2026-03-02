const sendEmail = require('./sendEmail')

const sendResetPasswordEmail = async ({name, email, resetPasswordToken, origin}) => {
  const subject = 'Password reset link'
  
  const resetLink = `${origin}/api/v1/auth/reset-password/query?token=${resetPasswordToken}&email=${email}`
  
  const html = `<p>Dear ${name}! Click the link below to reset your password:<p/>
  <a href ="${resetLink}">reset password</a>`

  return await sendEmail({
    to: email, 
    subject, 
    html})
}

module.exports = sendResetPasswordEmail