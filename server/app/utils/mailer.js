import nodemailer from 'nodemailer';
import User from '../models/user';

const getAdmins = async () => {
  const admins = await User.find({ role: 'admin' });
  return admins.map(user => user.email);
};

export const notifyAdmins = async (subject, body) => {
  let transport;
  try {
    transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'notifications@waysphone.com',
        pass: process.env.API_EMAIL_PASSWORD,
      },
    });
  } catch (err) {
    console.log(err);
  }
  const admins = await getAdmins();

  const message = {
    from: 'miles@waysphone.com',
    to: admins.join(','),
    subject: subject,
    text: body,
  };
  if (!transport) return;
  transport.sendMail(message, error => {
    if (error) console.log(error);
  });
};
