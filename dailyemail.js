const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Configure your email transporter. (This example uses Gmail; adjust settings as needed.)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'amirahnufahaulya@students.ignatiusglobal.sch.id',
    pass: 'KDIEPHRW' // Consider using environment variables for security.
  }
});

// Define the email message details
const mailOptions = {
  from: 'amirahnufahaulya@students.ignatiusglobal.sch.id',
  to: 'amirahna77@gmail.com', // or another email address
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
