import * as chai from 'chai';
import server from '../utils/server.mock';
const expect = chai.expect;

import User from '../../app/models/user';

const masterUserCopy = {
  username: 'daniel',
  email: 'daniel@craig.com',
  password: 'thisisapassword2',
};

let savedUser;
let defaultUser;

describe('Model: User', () => {
  before(async () => {
    await User.remove({});

    const user = new User(masterUserCopy);
    savedUser = await user.save();
    return;
  });

  beforeEach(() => {
    defaultUser = Object.assign({}, masterUserCopy);
  });

  describe('#save', () => {
    it('requires an email, username and passwrod', () => {
      const user = new User();

      const { errors } = user.validateSync();

      expect(errors.username).to.be.defined;
      expect(errors.email).to.be.defined;
      expect(errors.password).to.be.defined;
    });

    it('requires a valid email', () => {
      const wrongEmail = 'thisaintanemail';
      defaultUser.email = wrongEmail;

      const user = new User(defaultUser);

      const { errors } = user.validateSync();

      expect(errors.email).to.be.defined;
      expect(errors.email.message).to.equal(
        `${wrongEmail} is not a valid email.`
      );
    });

    it('should validate password strength', () => {
      const user = new User(defaultUser);
      user.password = 'wrong';

      let validation = user.validateSync();

      expect(validation.errors.password).to.be.defined;
      expect(validation.errors.password.message).to.equal(
        'Password must be at least 12 characters long and contain at least 1 number.'
      );

      user.password = 'thisisapassword';
      validation = user.validateSync();

      expect(validation.errors.password).to.be.defined;

      user.password = 'thisisapassword1';
      validation = user.validateSync();

      expect(validation).to.be.undefined;
    });
  });

  describe('#authenticate', () => {
    it('should be authenticated with the correct password', () => {
      expect(savedUser.authenticate(defaultUser.password)).to.be.truthy;
    });

    it('should not be authenticated with an incorrect password', () => {
      expect(savedUser.authenticate('wrongpassword')).to.be.falsy;
    });
  });

  describe('#update password', () => {
    it('should update user password if original password matches', async () => {
      const result = await savedUser.updatePassword(
        'thisisapassword2',
        'thisisapassword1'
      );
      expect(result).to.equal('Password updated successfully.');

      expect(savedUser.authenticate('thisisapassword2')).to.eq(false);
      expect(savedUser.authenticate('thisisapassword1')).to.eq(true);
    });

    it('should return an error if the original password does not match', async () => {
      const result = await savedUser.updatePassword(
        'incorrectPassword',
        'thisisanewpassword'
      );
      expect(result).to.equal('Incorrect details entered.');

      expect(savedUser.authenticate('thisisanewpassword')).to.eq(false);
      expect(savedUser.authenticate('thisisapassword1')).to.eq(true);
    });
  });

  describe('#toJSON', () => {
    it('should remove password', () => {
      const jsonUser = savedUser.toJSON();
      expect(savedUser.password).to.exist;
      expect(jsonUser.password).to.not.exist;
    });

    it('should remove __v', () => {
      const jsonUser = savedUser.toJSON();
      expect(savedUser.__v).to.exist;
      expect(jsonUser.__v).to.not.exist;
    });

    it('should convert _id to id', () => {
      const jsonUser = savedUser.toJSON();
      expect(savedUser._id).to.exist;
      expect(jsonUser._id).to.not.exist;
      expect(jsonUser.id).to.exist;
    });
  });
});
