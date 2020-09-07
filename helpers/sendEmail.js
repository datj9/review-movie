const nodemailer = require("nodemailer");
const emailAddress = process.env.EMAIL_ADDRESS;
const emailPassword = process.env.EMAIL_PASSWORD;
const { promisify } = require("util");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailAddress,
        pass: emailPassword,
    },
});

const sendEmail = promisify(transporter.sendMail).bind(transporter);

const sendEmailRecoverPassword = async (to, token) => {
    const sentToken = token.slice(0, 4) + " " + token.slice(4, 8);
    const mailOptions = {
        from: emailAddress,
        to,
        subject: "Khôi phục mật khẩu",
        html: `<p>Mã xác thực của bạn là: <strong>${sentToken}</strong></p>`,
    };

    try {
        await sendEmail(mailOptions);

        return {
            isSuccess: true,
        };
    } catch (error) {
        console.log(error);
        return {
            isSuccess: false,
        };
    }
};

module.exports = { sendEmailRecoverPassword };
