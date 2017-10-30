import { expect } from 'chai';
import Promise from 'bluebird';
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
let record;

describe(`POST ${ENDPOINT}/:client/:campaign`, () => {
  before(async () => {
    await User.remove({});
    await Client.remove({});
    await Campaign.remove({});
    user = await User.create(UserFactory.generate());
    admin = await User.create(UserFactory.generateAdmin());
    client = await Client.create({ name: 'Miles', creator: 'miles' });
    campaign = await Campaign.create({
      name: 'Call Flow',
      creator: 'miles',
      client,
      contactspaceId: 440,
    });

    record = await Record.create({
      ...RecordFactory.generate(),
      client,
      campaign,
      creator: user.username,
    });
  });

  describe('#201', () => {
    it('can handle pushing lots of records to contactspace', done => {
      const newRecords = RecordFactory.generateList(10);
      let results = [];
      Promise.map(newRecords, record => {
        return server
          .post(`${ENDPOINT}/${client.path}/${campaign.path}`)
          .send(record)
          .set('Authorization', user.generateToken());
      })
        .then(() => {
          Record.find({}).then(records => {
            expect(records.length).to.eq(11);
            done();
          });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });

    it('an authorized user can push a record', done => {
      const newRecord = RecordFactory.generate();

      server
        .post(`${ENDPOINT}/${client.path}/${campaign.path}`)
        .send(newRecord)
        .set('Authorization', user.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.id).to.be.defined;
          expect(res.body.valid).to.eq(true);

          done();
        });
    });

    it('a record with a single valid number will be valid', done => {
      const newRecord = RecordFactory.generate();

      server
        .post(`${ENDPOINT}/${client.path}/${campaign.path}`)
        .send(newRecord)
        .set('Authorization', user.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.id).to.be.defined;
          expect(res.body.valid).to.eq(true);

          done();
        });
    });

    it('a record without a single valid number will be invalid', done => {
      const newRecord = RecordFactory.generate();
      delete newRecord.mobilephone;
      delete newRecord.homephone;
      server
        .post(`${ENDPOINT}/${client.path}/${campaign.path}`)
        .send(newRecord)
        .set('Authorization', user.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.id).to.be.defined;
          expect(res.body.valid).to.eq(false);

          done();
        });
    });
  });
  describe('#401', () => {
    it('an unauthorized user cannot push a record', done => {
      const newRecord = RecordFactory.generate();

      server.post(`${ENDPOINT}/${client.path}/${campaign.path}`).send(newRecord).end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
    });
  });
  describe('#406', () => {
    it('an empty record cannot be pushed', done => {
      server
        .post(`${ENDPOINT}/${client.path}/${campaign.path}`)
        .set('Authorization', user.generateToken())
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(406);
          expect(res.body.message).to.eq('Record cannot be empty.');
          done();
        });
    });
  });
});
