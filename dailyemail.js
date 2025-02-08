// dailyemail.js
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const fs = require('fs');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// Fungsi untuk membaca entri jurnal hari ini dari file journal.json
function getTodaysJournal() {
  try {
    const data = fs.readFileSync('journal.json', 'utf8');
    const journalEntries = JSON.parse(data);
    const today = new Date().toISOString().split('T')[0];
    return journalEntries.find(entry => entry.date === today);
  } catch (error) {
    console.error('Error reading journal entries:', error);
    return null;
  }
}

// Fungsi untuk mendapatkan final score dari habitData hari ini dari file habitData.json
function getFinalScore() {
  try {
    const data = fs.readFileSync('habitData.json', 'utf8');
    const habitData = JSON.parse(data);
    const today = new Date().toISOString().split('T')[0];
    const todayHabit = habitData.find(entry => entry.date === today);
    if (!todayHabit) return null;
    const weights = {
      wakeUp: 0.5,
      shower: 0.5,
      prayer: 1.5,
      toDo: 0.5,
      read: 1.5,
      omad: 2.0,
      water: 1.5,
      noDistractions: 2.0,
      study: 2.0,
      journal: 0.5
    };
    let rawScore = 0;
    for (const key in weights) {
      if (todayHabit[key]) {
        rawScore += weights[key];
      }
    }
    const maxRawScore = 12.5;
    const scaleFactor = 10 / maxRawScore;
    return (rawScore * scaleFactor).toFixed(1);
  } catch (error) {
    console.error('Error reading habit data:', error);
    return null;
  }
}

// Setup transporter email (gunakan kredensial kamu sendiri)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@example.com',
    pass: 'your_password'
  }
});

// Fungsi untuk menyiapkan isi email dengan analisis NLP
function prepareEmailContent() {
  const journalEntry = getTodaysJournal();
  const finalScore = getFinalScore() || "N/A";
  let sentimentResult = { score: 0 };
  let journalText = "";
  if (journalEntry) {
    journalText = journalEntry.text;
    sentimentResult = sentiment.analyze(journalText);
  }
  let sentimentMessage = "";
  if (sentimentResult.score > 0) {
    sentimentMessage = "You seem to be in a positive mood today!";
  } else if (sentimentResult.score < 0) {
    sentimentMessage = "It looks like you had a challenging day. Keep pushing forward!";
  } else {
    sentimentMessage = "Today seems balanced. Keep up the consistent work!";
  }
  
  return `
Congratulations! You have managed to complete your habits today.
Final Score: ${finalScore}/10.
Journal Summary: ${sentimentMessage}
Your Journal: "${journalText}"
  `;
}

let mailOptions = {
  from: 'your_email@example.com',
  to: 'recipient_email@example.com',
  subject: 'Daily Habit Tracker Update',
  text: prepareEmailContent() // Isi akan di-update saat pengiriman
};

// Jadwalkan pengiriman email setiap hari jam 9 malam
cron.schedule('0 21 * * *', () => {
  mailOptions.text = prepareEmailContent();
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

console.log('Daily email scheduler started.');
