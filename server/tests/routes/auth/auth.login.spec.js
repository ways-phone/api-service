import * as chai from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const expect = chai.expect;

const ENDPOINT = '/api/auth/login';
let defaultUserPayload = UserFactory.generate();
let savedUser;

describe(`POST ${ENDPOINT}`, () => {
  before(async () => {
    await User.remove();
    savedUser = await User.create(defaultUserPayload);
  });

  describe('#200', () => {
    it('returns an auth token upon successful verification', async () => {
      const res = await server.post(ENDPOINT).send({
        username: savedUser.username,
        password: defaultUserPayload.password,
      });
      expect(res).to.have.status(200);
      expect(res.body.token).to.be.defined;
    });
  });

  describe('#401', () => {
    it('correct username, incorrect password', () => {
      server
        .post(ENDPOINT)
        .send({
          username: savedUser.username,
          password: 'wrong',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Please verify your credentials.');
        });
    });

    it('incorrect username, incorrect password', () => {
      server
        .post(ENDPOINT)
        .send({
          username: 'wrong',
          password: 'wrong',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Please verify your credentials.');
        });
    });
  });
});
