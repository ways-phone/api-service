import { expect } from 'chai';
import server from '../../utils/server.mock';
import Client from '../../../app/models/client';
import Campaign from '../../../app/models/campaign';
import User from '../../../app/models/user';
import ClientFactory from '../../factories/client.factory';
import UserFactory from '../../factories/user.factory';
import CampaignFactory from '../../factories/campaign.factory';

const ENDPOINT = '/api/clients';

let user;
let admin;
let client;
let campaign;

describe(`POST ${ENDPOINT}/:client`, () => {
  before(async () => {
    await User.remove({});
    await Client.remove({});
    await Campaign.remove({});
    user = await User.create(UserFactory.generate());
    admin = await User.create(UserFactory.generateAdmin());
    client = await Client.create(ClientFactory.generate());
    campaign = await Campaign.create({
      ...CampaignFactory.generate(),
      client,
    });
  });

  describe('#201', () => {
    it('an admin user can create a campaign', done => {
      const newCampaign = CampaignFactory.generate();
      server
        .post(`${ENDPOINT}/${client.path}`)
        .send(newCampaign)
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.name).to.be.defined;
          expect(res.body.name).to.eq(newCampaign.name);

          done();
        });
    });

    it('on campaign creation a path is set', done => {
      const newCampaign = CampaignFactory.generate();
      server
        .post(`${ENDPOINT}/${client.path}`)
        .send(newCampaign)
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.name).to.be.defined;
          expect(res.body.path).to.eq(newCampaign.name.replace(/\s/g, '_'));

          done();
        });
    });
  });

  describe('#400', () => {
    it('a campaign name must be unique', done => {
      server
        .post(`${ENDPOINT}/${client.path}`)
        .send(campaign)
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.exist;
          expect(res.body.errors.name).to.eq('Campaign already created.');

          done();
        });
    });

    it('an empty request body will fail', done => {
      server
        .post(`${ENDPOINT}/${client.path}`)
        .send({})
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.exist;
          expect(res.body.message).to.eq('Invalid campaign.');

          done();
        });
    });
  });

  describe('#403', () => {
    it('an non-admin user cannot create a campaign', done => {
      const newCampaign = CampaignFactory.generate();
      server
        .post(`${ENDPOINT}/${client.path}`)
        .send(newCampaign)
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
});
