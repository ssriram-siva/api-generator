const nodemailer = require("nodemailer");

const sendEmail = process.env.SEND_MAIL;
const password = process.env.PASSWORD;

module.exports = async (req, res) => {
  const { email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sendEmail,
        pass: password
      }
    });

    await transporter.sendMail({
      from: email,
      to: sendEmail,
      subject: "New Feedback",
      text: message
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};