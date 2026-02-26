import nodemailer from 'nodemailer';

// create a transporter singleton promise; controllers can await it
let transporterPromise = (async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('[mailer] using credentials from env');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  console.warn(
    '[mailer] EMAIL_USER or EMAIL_PASS not set; falling back to Ethereal test account'
  );
  const testAccount = await nodemailer.createTestAccount();
  console.log('[mailer] Ethereal account available at ' +
    `https://ethereal.email/login (user: ${testAccount.user}, pass: ${testAccount.pass})`);

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
})();

export default transporterPromise;
