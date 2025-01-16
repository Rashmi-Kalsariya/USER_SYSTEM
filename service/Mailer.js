const nodemailer = require("nodemailer");
const Queue = require("bull");
require("dotenv").config();

const emailQueue = new Queue("emailQueue", "redis://127.0.0.1:6379");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rashmikalsariya02@gmail.com",
    pass: process.env.APP_PASS,
  },
});

const SendMailer = async () => {
  emailQueue.process(async (job) => {
    const { to, subject, body } = job.data;

    console.log(`Processing email for: ${to}`);

    const mailOptions = {
      from: "rashmikalsariya02@gmail.com",
      to: to,
      subject: subject,
      text: body,
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}: ${info.messageId}`);
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
    }
  });

  emailQueue.on("completed", (job) => {
    console.log(`Email for ${job.data.to} sent successfully.`);
  });

  emailQueue.on("failed", (job, error) => {
    console.error(`Email for ${job.data.to} failed:`, error);
  });

  emailQueue.on("waiting", (jobId) => {
    console.log("Waiting for job:", jobId);
  });

  emailQueue.on("stalled", (jobId) => {
    console.log("Job stalled:", jobId);
  });
};

module.exports = SendMailer;
