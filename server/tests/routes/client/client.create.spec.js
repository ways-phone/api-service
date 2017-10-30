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

describe(`POST ${ENDPOINT}`, () => {
  before(async () => {
    await User.remove({});
    await Client.remove({});
    user = await User.create(UserFactory.generate());
    admin = await User.create(UserFactory.generateAdmin());
    client = await Client.create(ClientFactory.generate());
  });

  describe('#201', () => {
    it('creates and return client for admin user', done => {
      server
        .post(ENDPOINT)
        .send(ClientFactory.generate())
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.client).to.be.defined;
          done();
        });
    });

    it('sets path for a created client', done => {
      server
        .post(ENDPOINT)
        .send(ClientFactory.generate())
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.path).to.equal(res.body.name.replace(/\s/g, '_'));
          done();
        });
    });
  });

  describe('#400', () => {
    it('requires unique name', done => {
      server
        .post(ENDPOINT)
        .send(client.toJSON())
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.defined;
          expect(res.body.errors.name).to.equal('Client already created.');

          done();
        });
    });
  });

  describe('#401', () => {
    it('requires auth token', done => {
      server.post(ENDPOINT).send(client.toJSON()).end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
    });
  });

  describe('#403', () => {
    it('a non admin cannot create a client', done => {
      server
        .post(ENDPOINT)
        .send(client.toJSON())
        .set('Authorization', user.generateToken())
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
