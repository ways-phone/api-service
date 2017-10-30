import { expect } from 'chai';
import server from '../../utils/server.mock';
import Client from '../../../app/models/client';
import User from '../../../app/models/user';
import ClientFactory from '../../factories/client.factory';
import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/api/clients';

let user;
describe(`GET ${ENDPOINT}`, () => {
  before(async () => {
    await User.remove({});
    await Client.remove({});
    user = await User.create(UserFactory.generate());
    await Client.create(ClientFactory.generateList(5));
  });

  describe('#200', () => {
    it('should return a list of clients for an authorized user', done => {
      server
        .get(ENDPOINT)
        .set('Authorization', user.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.eq(5);
          done();
        });
    });
  });

  describe('#401', () => {
    it('should return an error for an unauthorzed user', done => {
      server.get(`${ENDPOINT}`).end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.be.defined;
        expect(res.body.message).to.eq('jwt must be provided');
        done();
      });
    });
  });
});
