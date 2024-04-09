import nodemailer from "nodemailer";

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

// Function to send an email
const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        await transporter.sendMail({
            from: "your-email@example.com",
            to,
            subject,
            text
        });
        console.log("Email sent successfully");
    } catch (err) {
        console.error("Error sending email:", err);
    }
};

export { sendEmail };
