const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
exports.sendOnBoardingEmailToProvider = async (email, name) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        Subject: `Welcome Aboard, ${name}! Your Journey with Alltasko Begins`,
        text: `Dear ${name},
            Welcome to Alltasko! We’re excited to have you join our growing community of service providers, connecting with customers across the United States.
            Before you start receiving leads for handyman services—including moving, plumbing, cleaning, and many more—your account needs to go through a verification process. Our team will review your submitted documents to ensure they meet the necessary qualifications and valid proof of experience in your field.
            Once approved, you’ll be able to access high-quality leads, grow your business, and provide exceptional services to customers who need your expertise.

            What’s next?
            🔹 Our team is reviewing your documents.
            🔹 You’ll receive an update once your account is approved.
            🔹 If any additional details are needed, we’ll reach out to you.

            If you have any questions or need assistance, feel free to contact us at support@alltasko.com.
            We look forward to helping you succeed!

        Best regards,
        The Alltasko Team`
    }
    await transporter.sendMail(mailOptions);
}