import { expect } from 'chai';
import server from '../../utils/server.mock';
import Client from '../../../app/models/client';
import Campaign from '../../../app/models/campaign';
import User from '../../../app/models/user';
import Record from '../../../app/models/record';
import ClientFactory from '../../factories/client.factory';
import UserFactory from '../../factories/user.factory';
import CampaignFactory from '../../factories/campaign.factory';
import RecordFactory from '../../factories/record.factory';

const ENDPOINT = '/api/clients';

let user;
let admin;
let client;
let campaign;
let campaign2;
let records;
let records2;

describe(`GET ${ENDPOINT}/:client/:campaign`, () => {
  before(async () => {
    await User.remove({});
    await Client.remove({});
    await Campaign.remove({});
    await Record.remove({});
    user = await User.create(UserFactory.generate());
    admin = await User.create(UserFactory.generateAdmin());
    client = await Client.create(ClientFactory.generate());
    campaign2 = await Campaign.create({
      ...CampaignFactory.generate(),
      client,
    });
    campaign = await Campaign.create({
      ...CampaignFactory.generate(),
      client,
    });
    records = await Record.create(
      RecordFactory.generateList(5, {
        client,
        campaign,
        creator: user.username,
      })
    );
    records2 = await Record.create(
      RecordFactory.generateList(10, {
        client,
        campaign: campaign2,
        creator: user.username,
      })
    );
  });

  describe('#201', () => {
    it('an admin user can retrieve records', done => {
      server
        .get(`${ENDPOINT}/${client.path}/${campaign.path}`)
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.eq(5);
          done();
        });
    });

    it('the correct campaign records are selected', done => {
      server
        .get(`${ENDPOINT}/${client.path}/${campaign2.path}`)
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.eq(10);
          done();
        });
    });

    it('the campaign and client properties are set to the respective names', done => {
      server
        .get(`${ENDPOINT}/${client.path}/${campaign2.path}`)
        .set('Authorization', admin.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.eq(10);
          expect(res.body[0].client).to.equal(client.name);
          expect(res.body[0].campaign).to.equal(campaign2.name);
          done();
        });
    });
  });

  describe('#403', () => {
    it('an non-admin user cannot retrieve records', done => {
      server
        .get(`${ENDPOINT}/${client.path}/${campaign.path}`)
        .set('Authorization', user.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.message).to.equal(
            'You do not have the correct permissions to access this page.'
          );

          done();
        });
    });
  });
});
