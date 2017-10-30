import { expect } from 'chai';
import server from '../../utils/server.mock';
import Client from '../../../app/models/client';
import User from '../../../app/models/user';
import ClientFactory from '../../factories/client.factory';
import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/api/clients';

let user;
let admin;
let client;

describe(`Base Controller Filter Params`, () => {
  before(async () => {
    await User.remove({});
    await Client.remove({});
    user = await User.create(UserFactory.generate());
    admin = await User.create(UserFactory.generateAdmin());
    client = await Client.create(ClientFactory.generate());
  });

  it('removes un whitelisted parameters', done => {
    server
      .post(ENDPOINT)
      .send({ name: 'test', extra1: 'asd', extra2: 'asd' })
      .set('Authorization', admin.generateToken())
      .end((err, res) => {
        expect(res).to.have.status(201);

        expect(res.body.extra1).to.not.exist;
        expect(res.body.extra2).to.not.exist;
        done();
      });
  });
});
