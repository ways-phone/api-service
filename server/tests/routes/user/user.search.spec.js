import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/api/users';
let admin;
let client;
describe(`GET ${ENDPOINT}`, () => {
  before(async () => {
    await User.remove({});
    admin = await User.create(UserFactory.generateAdmin());
    client = await User.create(UserFactory.generate());
    await User.insertMany(UserFactory.generateList(3));
  });

  describe('#200', () => {
    it('should return an array of users', done => {
      server
        .get(ENDPOINT)
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf(5);
          done();
        });
    });
  });
  describe('#403', () => {
    it('should return unauthorized if a non-admin tries to access all users', done => {
      server
        .get(ENDPOINT)
        .set('Authorization', client.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.message).to.be.defined;
          expect(res.body.message).to.equal(
            'You do not have the correct permissions to access this page.'
          );
          done();
        });
    });
  });
});
