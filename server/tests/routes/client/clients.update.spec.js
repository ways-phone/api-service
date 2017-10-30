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
let client2;

describe(`PUT ${ENDPOINT}/:client`, () => {
  beforeEach(async () => {
    await User.remove({});
    await Client.remove({});
    user = await User.create(UserFactory.generate());
    admin = await User.create(UserFactory.generateAdmin());
    client = await Client.create(ClientFactory.generate());
    client2 = await Client.create(ClientFactory.generate());
  });

  describe('#201', () => {
    it('an admin user can update a client', done => {
      server
        .put(`${ENDPOINT}/${client.path}`)
        .send({ name: 'test' })
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.defined;
          expect(res.body.name).to.eq('test');
          expect(res.body.path).to.eq('test');
          done();
        });
    });
  });

  describe('#403', () => {
    it('an non-admin user cannot update a client', done => {
      server
        .put(`${ENDPOINT}/${client.path}`)
        .send({ name: 'test' })
        .set('Authorization', user.generateToken())
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

  describe('#500', () => {
    it('cannot update a client with a preexisting clients name', done => {
      server
        .put(`${ENDPOINT}/${client.path}`)
        .send({ name: client2.name })
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.errors.name).to.be.defined;
          expect(res.body.errors.name).to.eq('Client already created.');

          done();
        });
    });
  });
});
