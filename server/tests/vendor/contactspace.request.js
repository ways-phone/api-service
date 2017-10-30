import * as chai from 'chai';
import server from '../utils/server.mock';
import Dataset from '../../app/models/dataset';
import Client from '../../app/models/client';
import Campaign from '../../app/models/campaign';
import Record from '../../app/models/record';
import RecordFactory from '../factories/record.factory';

const expect = chai.expect;

const masterClientCopy = {
  name: 'MSF',
  creator: 'miles',
};

const masterCampaignCopy = {
  name: 'Lead Conversion',
  creator: 'miles',
  contactspaceId: 440,
};
let client;
let campaign;

describe('Vendor: Contact Space APIs', () => {
  before(async () => {
    await Campaign.remove({});
    await Client.remove({});
    client = await new Client(masterClientCopy).save();
    campaign = await new Campaign({
      ...masterCampaignCopy,
      client,
    }).save();

    return;
  });

  beforeEach(async () => {
    await Dataset.remove({});
  });

  // describe('#Create Dataset', async () => {
  //   it('should set the expires and isActive attr on creation', () => {
  //     const dataset = new Dataset({
  //       client,
  //       campaign,
  //     });

  //     expect(dataset.campaign).to.exist;
  //     expect(dataset.expires).to.exist;
  //     expect(dataset.isActive).to.eq(true);
  //   });

  //   it('creates a name using the expire date', async () => {
  //     const expires = new Date(2017, 7, 21);
  //     const dataset = new Dataset({
  //       client,
  //       campaign,
  //       expires,
  //     });
  //     const name = await dataset._setName();

  //     expect(name).to.eq('MSF Lead Conversion:: W/C 14/08/2017');
  //   });

  //   it('should mark all other datasets as inactive when saving a new dataset', async () => {
  //     const expires = new Date(2017, 7, 21);
  //     const dataset = new Dataset({
  //       client,
  //       campaign,
  //     });

  //     const dataset2 = new Dataset({
  //       client,
  //       campaign,
  //       expires,
  //     });

  //     const saved = await dataset.save();
  //     expect(saved.isActive).to.eq(true);
  //     const saved2 = await dataset2.save();
  //     const active = await Dataset.find({ isActive: true });
  //     expect(active.length).to.eq(1);
  //     expect(active[0].name).to.eq('MSF Lead Conversion:: W/C 14/08/2017');
  //   });
  //   // it('correctly creates a dataset in Contact Space', async () => {
  //   //   const dataset = new Dataset({
  //   //     client,
  //   //     campaign,
  //   //   });
  //   //   dataset.name = await dataset._setName();
  //   //   const id = await dataset._setID();
  //   //   console.log(id);
  //   //   expect(id).to.exist;
  //   // });
  // });
  // describe('#Expired', () => {
  //   it('dataset has expired if expires attr is in the past', async () => {
  //     const expires = new Date(2017, 7, 7);
  //     const dataset = new Dataset({
  //       client,
  //       campaign,
  //       expires,
  //     });
  //     expect(dataset.hasExpired()).to.eq(true);
  //   });

  //   it('dataset has not expire if expires attr is in the future', async () => {
  //     const expires = new Date(2100, 7, 21);
  //     const dataset = new Dataset({
  //       client,
  //       campaign,
  //       expires,
  //     });
  //     expect(dataset.hasExpired()).to.eq(false);
  //   });
  // });
  // describe('#Push Record to Dataset', () => {
  //   it('should create a dataset, push the record and mark as exported', async () => {
  //     let record = new Record({ ...RecordFactory.generate(), client, campaign, creator: 'miles' });
  //     const saved = await record.save();
  //     const { wasPushed, error } = await saved.pushRecordToContactSpace();
  //     expect(wasPushed).to.eq(true);
  //     expect(error).to.not.exist;
  //   });
  // });
});
