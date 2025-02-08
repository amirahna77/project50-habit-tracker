const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Configure your email transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'amirahnufahaulya@students.ignatiusglobal.sch.id',
    pass: 'KDIEPHRW' // Not recommended to keep credentials in code—use environment variables ideally
  }
});

// Define the email message details
const mailOptions = {
  from: 'amirahnufahaulya@students.ignatiusglobal.sch.id',
  to: 'amirahna77@gmail.com', // or any other email
  subject: 'Daily Habit Tracker Update',
  text: 'Today, you completed all of your habits. Keep up the great work!'
};

// Schedule the email to be sent every day at 9:00 PM
cron.schedule('0 21 * * *', () => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

console.log('Daily email scheduler started.');
