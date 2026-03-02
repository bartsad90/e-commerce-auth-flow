const sendEmail = require("./sendEmail");


const sendVerificationEmail = async (name, email, verificationToken, origin) => {
  const verifyEmailURL = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
  const message = 
  `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmailURL}">Verify Email</a></p>`
  return await sendEmail({
    to: email,
    subject: "Email verification",
    html: `<h4>Hello ${name}<h4>${message}` 
  });
};

module.exports = sendVerificationEmail;
