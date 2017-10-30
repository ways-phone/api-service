import * as chai from 'chai';
import server from '../utils/server.mock';
const expect = chai.expect;

import Campaign from '../../app/models/campaign';
import Client from '../../app/models/client';
import Record from '../../app/models/record';

const mastClientCopy = {
  name: 'MSF',
  creator: 'miles',
};

const masterCampaignCopy = {
  name: 'Lead Conversion',
  creator: 'miles',
  contactspaceId: 1,
};

const masterRecordCopy = {
  title: 'mr',
  firstname: 'miles',
  lastname: 'johnson',
  gender: 'm',
  address1: '50 flood st',
  suburb: 'leichhardt',
  state: 'nsw',
  postcode: '2040',
  email: 'miles@test.com',
};

let savedRecord;
let campaign;
let campaign2;
let client;
let defaultRecord;

describe('Model: Record', () => {
  before(async () => {
    await Campaign.remove({});
    await Client.remove({});
    await Record.remove({});

    client = await new Client(mastClientCopy).save();
    campaign = await new Campaign({
      ...masterCampaignCopy,
      client,
    }).save();
    campaign2 = await new Campaign({
      name: 'Recycled',
      client,
      creator: 'miles',
      contactspaceId: 2,
    });
    savedRecord = await new Record({
      ...masterRecordCopy,
      client,
      campaign,
      creator: 'miles',
    }).save();
    return;
  });

  beforeEach(async () => {
    await Record.remove({});
    defaultRecord = {
      ...masterRecordCopy,
      client,
      campaign,
      creator: 'miles',
    };
  });
  describe('#save', () => {
    it('requires a client', () => {
      const record = new Record(masterRecordCopy);

      const { errors } = record.validateSync();

      expect(errors.client).to.be.defined;
    });

    it('requires a campaign', () => {
      const record = new Record(masterRecordCopy);

      const { errors } = record.validateSync();

      expect(errors.campaign).to.be.defined;
    });
    it('capitalizes first name', () => {
      expect(savedRecord.firstname).to.equal('Miles');
    });

    it('capitalizes last name', () => {
      expect(savedRecord.lastname).to.equal('Johnson');
    });

    it('capitalizes title', () => {
      expect(savedRecord.title).to.equal('Mr');
    });

    it('sets full gender', () => {
      expect(savedRecord.gender).to.equal('Male');
    });

    it('sets state to uppercase', () => {
      expect(savedRecord.state).to.equal('NSW');
    });

    it('sets suburb to uppercase', () => {
      expect(savedRecord.suburb).to.equal('LEICHHARDT');
    });
  });
  describe('#phone validation', () => {
    it('sets isInvalid to true if no phone numbers', () => {
      expect(savedRecord.isInvalid).to.equal(true);
    });

    it('sets isInvalid to false if one number is set', async () => {
      defaultRecord.mobilephone = '0498092179';
      const toSave = new Record(defaultRecord);

      const record = await toSave.save();

      expect(record.isInvalid).to.eq(false);
    });

    it('sets phone 1 as mobile if mobilephone exists', async () => {
      defaultRecord.mobilephone = '0498092179';
      const toSave = new Record(defaultRecord);

      const record = await toSave.save();

      expect(record.phone1).to.eq('61498092179');
      expect(record.phone2).to.eq('');
    });
    it('switches home to mobile if no mobile exists', async () => {
      defaultRecord.homephone = '0498092179';
      const toSave = new Record(defaultRecord);

      const record = await toSave.save();

      expect(record.mobilephone).to.eq('498092179');
      expect(record.homephone).to.eq('');
      expect(record.phone1).to.eq('61498092179');
    });

    it('switches mobile to home if no home exists', async () => {
      defaultRecord.mobilephone = '0246557554';
      const toSave = new Record(defaultRecord);

      const record = await toSave.save();

      expect(record.homephone).to.eq('246557554');
      expect(record.mobilephone).to.eq('');
      expect(record.phone1).to.eq('61246557554');
    });

    it('switches home and mobile if they both exist', async () => {
      defaultRecord.mobilephone = '0246557554';
      defaultRecord.homephone = '0498092179';
      const toSave = new Record(defaultRecord);

      const record = await toSave.save();

      expect(record.homephone).to.eq('246557554');
      expect(record.mobilephone).to.eq('498092179');
      expect(record.phone1).to.eq('61498092179');
      expect(record.phone2).to.eq('61246557554');
    });

    it('handles phone numbers with spaces and other non digit characters', async () => {
      defaultRecord.mobilephone = '02++465 575 54';
      const toSave = new Record(defaultRecord);

      const record = await toSave.save();

      expect(record.homephone).to.eq('246557554');
      expect(record.phone1).to.eq('61246557554');
    });

    it('handles phone numbers already prepended with 61', async () => {
      defaultRecord.mobilephone = '6102++465 615 54';
      const toSave = new Record(defaultRecord);

      const record = await toSave.save();

      expect(record.homephone).to.eq('246561554');
      expect(record.phone1).to.eq('61246561554');
    });

    it('sets the record as invalid if a single number is set with an incorrect length', async () => {
      defaultRecord.mobilephone = '6102++465 61 54';
      const toSave = new Record(defaultRecord);

      const record = await toSave.save();

      expect(record.isInvalid).to.eq(true);
    });

    it('sets record valid if a single number is set with an incorrect length, but a correct number is given', async () => {
      defaultRecord.mobilephone = '6102++465 61 54';
      defaultRecord.homephone = '0498092179';
      const toSave = new Record(defaultRecord);

      const record = await toSave.save();

      expect(record.isInvalid).to.eq(false);
      expect(record.phone1).to.eq('61498092179');
      expect(record.phone2).to.eq('');
    });
  });
  describe('#Duplication', () => {
    it('should mark a record a dupe if it has the same mobile and is within 6 months', async () => {
      defaultRecord.mobilephone = '0498092179';
      const toSave = new Record(defaultRecord);

      const dupe = new Record(defaultRecord);
      toSave.created = new Date(2017, 3, 10);
      const saved = await toSave.save();

      const dupesave = await dupe.save();

      expect(dupesave.isDuplicate).to.eq(true);
    });

    it('should mark a record a dupe if it has the same home and is within 6 months', async () => {
      defaultRecord.homephone = '0298092179';
      const toSave = new Record(defaultRecord);

      const dupe = new Record(defaultRecord);
      toSave.created = new Date(2017, 4, 10);
      const saved = await toSave.save();

      const dupesave = await dupe.save();

      expect(dupesave.isDuplicate).to.eq(true);
    });

    it('should mark a record a dupe if it has the same home and is within 6 months', async () => {
      defaultRecord.homephone = '0298092179';
      defaultRecord.email = 'dupe@email.com';
      const toSave = new Record(defaultRecord);

      const dupe = new Record(defaultRecord);
      dupe.homephone = '0299584757';
      toSave.created = new Date(2017, 4, 10);
      const saved = await toSave.save();

      const dupesave = await dupe.save();

      expect(dupesave.isDuplicate).to.eq(true);
    });

    it('should NOT mark a record a dupe if it has the same mobile and is NOT within 6 months', async () => {
      defaultRecord.mobilephone = '0498092179';
      const toSave = new Record(defaultRecord);

      const dupe = new Record(defaultRecord);
      toSave.created = new Date(2016, 3, 10);
      const saved = await toSave.save();

      const dupesave = await dupe.save();

      expect(dupesave.isDuplicate).to.eq(false);
    });

    it('should NOT mark a record a dupe if it has the same home and is NOT within 6 months', async () => {
      defaultRecord.homephone = '0298092179';
      const toSave = new Record(defaultRecord);

      const dupe = new Record(defaultRecord);
      toSave.created = new Date(2016, 4, 10);
      const saved = await toSave.save();

      const dupesave = await dupe.save();

      expect(dupesave.isDuplicate).to.eq(false);
    });

    it('should NOT mark a record a dupe if it has the same email and is NOT within 6 months', async () => {
      defaultRecord.homephone = '0298092179';
      defaultRecord.email = 'dupe@email.com';
      const toSave = new Record(defaultRecord);

      const dupe = new Record(defaultRecord);
      dupe.homephone = '0299584757';
      toSave.created = new Date(2016, 4, 10);
      const saved = await toSave.save();

      const dupesave = await dupe.save();

      expect(dupesave.isDuplicate).to.eq(false);
    });

    it('should NOT mark a record a dupe if it has the same mobile and is on a different campaign', async () => {
      defaultRecord.mobilephone = '0498092179';
      const toSave = new Record(defaultRecord);

      const dupe = new Record({ ...defaultRecord, campaign: campaign2 });
      dupe.homephone = '0299584757';
      const saved = await toSave.save();

      const dupesave = await dupe.save();

      expect(dupesave.isDuplicate).to.eq(false);
    });

    it('should NOT mark a record a dupe if it has the same home and is on a different campaign', async () => {
      defaultRecord.homephone = '0298092179';
      const toSave = new Record(defaultRecord);

      const dupe = new Record({ ...defaultRecord, campaign: campaign2 });

      const saved = await toSave.save();

      const dupesave = await dupe.save();

      expect(dupesave.isDuplicate).to.eq(false);
    });

    it('should NOT mark a record a dupe if it has the same email and is on a different campaign', async () => {
      defaultRecord.homephone = '0298092179';
      defaultRecord.email = 'dupe@email.com';
      const toSave = new Record(defaultRecord);

      const dupe = new Record({ ...defaultRecord, campaign: campaign2 });
      const saved = await toSave.save();

      const dupesave = await dupe.save();

      expect(dupesave.isDuplicate).to.eq(false);
    });
  });
  describe('#toJSON', () => {
    it('should remove __v', () => {
      const jsonRecord = savedRecord.toJSON();
      expect(savedRecord.__v).to.exist;
      expect(jsonRecord.__v).to.not.exist;
    });

    it('should convert _id to id', () => {
      const jsonRecord = savedRecord.toJSON();
      expect(savedRecord._id).to.exist;
      expect(jsonRecord._id).to.not.exist;
      expect(jsonRecord.id).to.exist;
    });
  });
});
