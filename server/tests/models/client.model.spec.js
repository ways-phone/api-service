import * as chai from 'chai';
import server from '../utils/server.mock';
const expect = chai.expect;

import Client from '../../app/models/client';

const masterClientCopy = {
  name: 'Medecins Sans frontieres',
  creator: 'miles',
};

let savedClient;
let defaultClient;

describe('Model: Client', () => {
  before(async () => {
    await Client.remove({});
    const client = new Client(masterClientCopy);
    savedClient = await client.save();
    return;
  });

  beforeEach(() => {
    defaultClient = Object.assign({}, masterClientCopy);
  });

  describe('#save', () => {
    it('requires a name', () => {
      const client = new Client();

      const { errors } = client.validateSync();

      expect(errors.name).to.be.defined;
    });

    it('requires a creator', () => {
      const client = new Client({ name: 'nocreator' });

      const { errors } = client.validateSync();

      expect(errors.creator).to.be.defined;
    });

    it('sets the path on save', () => {
      expect(savedClient.path).to.be.defined;
      expect(savedClient.path).to.eq(savedClient.name.replace(/\s/g, '_'));
    });
  });

  describe('#toJSON', () => {
    it('should remove __v', () => {
      const jsonClient = savedClient.toJSON();
      expect(savedClient.__v).to.exist;
      expect(jsonClient.__v).to.not.exist;
    });

    it('should convert _id to id', () => {
      const jsonClient = savedClient.toJSON();
      expect(savedClient._id).to.exist;
      expect(jsonClient._id).to.not.exist;
      expect(jsonClient.id).to.exist;
    });
  });
});
