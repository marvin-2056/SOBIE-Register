const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/', async (req, res) => {
  const { fullname, email, event } = req.body;

  try {
    const reg = new Registration({ fullname, email, event });
    await reg.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Event Registration Confirmation',
      text: `Hello ${fullname},\n\nYou are registered for the ${event}.`
    };

    await transporter.sendMail(mailOptions);
    res.redirect(`/confirm.html?name=${encodeURIComponent(fullname)}&email=${encodeURIComponent(email)}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

module.exports = router;
