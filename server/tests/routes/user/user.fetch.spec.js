import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/api/users';
let admin;
let client;
describe(`GET ${ENDPOINT}/:username`, () => {
  before(async () => {
    await User.remove({});
    admin = await User.create(UserFactory.generateAdmin());
    client = await User.create(UserFactory.generate());
  });

  describe('#200', () => {
    it('should return the user profile.', done => {
      server
        .get(`${ENDPOINT}/${client.username}`)
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.username).to.equal(client.username);
          done();
        });
    });
  });
  describe('#401', () => {
    it('should return Unauthorized if wrong token is provided', done => {
      server
        .get(`${ENDPOINT}/${client.username}`)
        .set('Authorization', 'wrongtoken')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.be.defined;
          expect(res.body.message).to.eq('jwt malformed');
          done();
        });
    });
  });
  describe('#403', () => {
    it('should return forbidden if not called with admin rights', done => {
      server
        .get(`${ENDPOINT}/${client.username}`)
        .set('Authorization', client.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.message).to.be.defined;
          expect(res.body.message).to.eq(
            'You do not have the correct permissions to access this page.'
          );
          done();
        });
    });
  });
  describe('#404', () => {
    it('should return 404 if username does not exist', done => {
      server
        .get(`${ENDPOINT}/wrongname`)
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.defined;
          expect(res.body.message).to.eq('User not found.');
          done();
        });
    });
  });
});

describe(`GET ${ENDPOINT}/me`, () => {
  before(async () => {
    await User.remove({});
    admin = await User.create(UserFactory.generateAdmin());
    client = await User.create(UserFactory.generate());
  });

  describe('#200', () => {
    it('should return the user profile.', done => {
      server
        .get(`${ENDPOINT}/me`)
        .set('Authorization', client.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.username).to.equal(client.username);
          done();
        });
    });
  });
  describe('#401', () => {
    it('should return Unauthorized if wrong token is provided', done => {
      server
        .get(`${ENDPOINT}/me`)
        .set('Authorization', 'wrongtoken')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.be.defined;
          expect(res.body.message).to.eq('jwt malformed');
          done();
        });
    });
  });
});
