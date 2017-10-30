import { expect } from 'chai';
import server from '../utils/server.mock';
import Client from '../../app/models/client';
import User from '../../app/models/user';
import ClientFactory from '../factories/client.factory';
import UserFactory from '../factories/user.factory';

const ENDPOINT = '/api/clients';

let user;
let admin;
let client;

describe('JSON Parser Error Handler', () => {
  before(async () => {
    await User.remove({});
    await Client.remove({});
    user = await User.create(UserFactory.generate());
    admin = await User.create(UserFactory.generateAdmin());
    client = await Client.create(ClientFactory.generate());
  });

  it('returns a JSON Parser error', done => {
    server
      .post(ENDPOINT)
      .send('"malformed": "asd,')
      .type('json')
      .set('Authorization', admin.generateToken())
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.be.defined;
        expect(res.body.details).to.be.defined;
        expect(res.body.message).to.eq('Invalid JSON');
        done();
      });
  });
});
