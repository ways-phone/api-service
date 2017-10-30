import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/api/users';
let defaultUserPayload = UserFactory.generate();
let savedUser;

describe(`POST ${ENDPOINT}`, () => {
  before(async () => {
    return User.remove({})
      .then(() => User.create(defaultUserPayload))
      .then(u => (savedUser = u));
  });

  beforeEach(() => {
    defaultUserPayload = UserFactory.generate();
  });

  describe('#201', () => {
    it('returns an auth token upon creation', done => {
      server
        .post(ENDPOINT)
        .send(
          UserFactory.generate({
            username: 'newusername',
            email: 'newemail@email.com',
          })
        )
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.token).to.be.defined;
          done();
        });
    });
  });

  describe('#400', () => {
    it('requires unique username and email', done => {
      server
        .post(ENDPOINT)
        .send({ ...savedUser.toJSON(), password: 'thiscouldbeapassword1' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.defined;
          expect(res.body.errors.email).to.equal('Email already in use.');
          expect(res.body.errors.username).to.equal('Username already taken.');
          done();
        });
    });

    it('requires a password', done => {
      delete defaultUserPayload.password;
      server.post(ENDPOINT).send(defaultUserPayload).end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors).to.be.defined;
        expect(res.body.errors.password).to.equal('Password is required.');
        done();
      });
    });

    it('requires a strong password', done => {
      server
        .post(ENDPOINT)
        .send(UserFactory.generate({ password: 'short' }))
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.defined;
          expect(res.body.errors.password).to.equal(
            'Password must be at least 12 characters long and contain at least 1 number.'
          );
          done();
        });
    });

    it('handles an empty json body', done => {
      server.post(ENDPOINT).send({}).end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors).to.be.defined;
        expect(res.body.errors.password).to.equal('Password is required.');
        expect(res.body.errors.email).to.equal('Email is required.');
        expect(res.body.errors.username).to.equal('Username is required.');
        done();
      });
    });
  });
});
