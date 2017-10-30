import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Constants from '../config/constants';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required.'],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Email is required.'],
      validate: {
        validator(email) {
          // eslint-disable-next-line max-len
          const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
          return emailRegex.test(email);
        },
        message: '{VALUE} is not a valid email.',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    role: {
      type: String,
      default: 'client',
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    delete obj.password;
    return obj;
  },
});

UserSchema.path('email').validate((email, respond) => {
  UserModel.findOne({ email })
    .then(user => {
      respond(user ? false : true);
    })
    .catch(() => {
      respond(false);
    });
}, 'Email already in use.');

UserSchema.path('username').validate((username, respond) => {
  UserModel.findOne({ username })
    .then(user => {
      respond(user ? false : true);
    })
    .catch(() => {
      respond(false);
    });
}, 'Username already taken.');

UserSchema.path('password').validate(password => {
  return password.length >= 12 && password.match(/\d+/g);
}, 'Password must be at least 12 characters long and contain at least 1 number.');

UserSchema.pre('save', function(done) {
  if (this.isModified('password')) {
    const { saltRounds } = Constants.security;
    this._hashPassword(this.password, saltRounds, (err, hash) => {
      if (err) throw new Error(err);
      this.password = hash;
      done();
    });
  } else {
    done();
  }
});

UserSchema.methods = {
  authenticate(password) {
    return bcrypt.compareSync(password, this.password);
  },

  generateToken() {
    return jwt.sign(
      { _id: this._id, firstname: this.firstname, lastname: this.lastname, role: this.role },
      Constants.security.sessionSecret,
      {
        expiresIn: Constants.security.sessionExpiration,
      }
    );
  },

  _hashPassword(password, saltRounds = Constants.security.saltRounds, callback) {
    return bcrypt.hash(password, saltRounds, callback);
  },

  async updatePassword(oldPassword, newPassword) {
    if (this.authenticate(oldPassword)) {
      try {
        this.password = await this._hashPassword(newPassword, Constants.security.saltRounds);
      } catch (err) {
        return err;
      }

      if (newPassword.length < 12 || !newPassword.match(/\d+/g)) {
        return {
          success: false,
          message: 'Password must be at least 12 characters long and contain at least 1 number.',
        };
      }

      try {
        await UserModel.update({ _id: this._id }, this);
        return { success: true, message: 'Password updated successfully.' };
      } catch (err) {
        return err;
      }
    } else {
      return { success: false, message: 'Incorrect details entered.' };
    }
  },
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
