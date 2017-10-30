import User from '../models/user';

const seed = async () => {
  const currentUsers = await User.find({});

  if (currentUsers.length > 0) return;

  const miles = new User({
    firstname: 'Miles',
    lastname: 'Johnson',
    email: 'miles@waysphone.com',
    username: 'Miles',
    password: process.env.ADMIN_USER_1_PWD,
    role: 'admin',
  });

  const lora = new User({
    firstname: 'Lora',
    lastname: 'Stockley',
    email: 'lora@waysphone.com',
    username: 'Lora',
    password: process.env.ADMIN_USER_2_PWD,
    role: 'admin',
  });

  await miles.save();
  await lora.save();
};

export default seed;
