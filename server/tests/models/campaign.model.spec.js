import * as chai from 'chai';
import server from '../utils/server.mock';
const expect = chai.expect;

import Campaign from '../../app/models/campaign';
import Client from '../../app/models/client';

const mastClientCopy = {
  name: 'MSF',
  creator: 'miles',
};

const masterCampaignCopy = {
  name: 'Lead Conversion 2',
  creator: 'miles',
  contactspaceId: 1,
};

let savedCampaign;
let defaultCampaign;

describe('Model: Campaign', () => {
  before(async () => {
    await Campaign.remove({});
    await Client.remove({});
    const campaign = new Campaign({
      ...masterCampaignCopy,
      client: await new Client(mastClientCopy).save(),
    });
    savedCampaign = await campaign.save();
    return;
  });

  beforeEach(() => {
    defaultCampaign = Object.assign({}, masterCampaignCopy);
  });

  describe('#save', () => {
    it('requires a name', () => {
      const campaign = new Campaign();

      const { errors } = campaign.validateSync();

      expect(errors.name).to.be.defined;
    });

    it('requires a client', () => {
      const campaign = new Campaign({ name: 'noclient' });

      const { errors } = campaign.validateSync();

      expect(errors.client).to.be.defined;
    });

    it('requires a creator', () => {
      const campaign = new Campaign({ name: 'nocreator' });

      const { errors } = campaign.validateSync();

      expect(errors.creator).to.be.defined;
    });

    it('sets the path on save', () => {
      expect(savedCampaign.path).to.be.defined;
      expect(savedCampaign.path).to.eq(savedCampaign.name.replace(/\s/g, '_'));
    });
  });

  describe('#toJSON', () => {
    it('should remove __v', () => {
      const jsonCampaign = savedCampaign.toJSON();
      expect(savedCampaign.__v).to.exist;
      expect(jsonCampaign.__v).to.not.exist;
    });

    it('should convert _id to id', () => {
      const jsonCampaign = savedCampaign.toJSON();
      expect(savedCampaign._id).to.exist;
      expect(jsonCampaign._id).to.not.exist;
      expect(jsonCampaign.id).to.exist;
    });
  });
});
