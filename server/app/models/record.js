import mongoose from 'mongoose';
import validation from '../utils/record-validation';
import { pushRecord } from '../vendor/contactspace';
import Dataset from '../models/dataset';
import Promise from 'bluebird';
const Schema = mongoose.Schema;

const RecordSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'A record must be associated with a Client'],
    },
    dataset: {
      type: Schema.Types.ObjectId,
      ref: 'Dataset',
    },
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'A record must be associated with a Campaign'],
    },
    source: {
      type: Schema.Types.ObjectId,
      ref: 'Source',
      required: [true, 'A record must be associated with a Source'],
    },
    custkey: { type: String },
    phone1: {
      type: String,
      set: validation.prependPhone,
    },
    phone2: {
      type: String,
      set: validation.prependPhone,
    },
    title: { type: String, set: validation.capitalize },
    firstname: { type: String, set: validation.capitalize },
    lastname: { type: String, set: validation.capitalize },
    gender: { type: String, set: validation.setGender },
    address1: { type: String },
    address2: { type: String },
    suburb: {
      type: String,
      uppercase: true,
    },
    state: {
      type: String,
      uppercase: true,
    },
    postcode: String,
    email: String,
    mobilephone: {
      type: String,
      set: validation.cleanPhone,
    },
    homephone: {
      type: String,
      set: validation.cleanPhone,
    },
    sitelabel: String,
    creator: {
      type: String,
      required: [true, 'A record must be associated with a creator.'],
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    isExported: {
      type: Boolean,
      default: false,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    isDuplicate: {
      type: Boolean,
      default: false,
    },
  },
  { strict: false }
);

RecordSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    delete obj._id;
    delete obj.__v;
    return obj;
  },
});

RecordSchema.pre('save', function(done) {
  // switch mobile and home phones
  const { mobile, home } = validation.switchHomeAndMobile(this.homephone, this.mobilephone);
  this.mobilephone = mobile;
  this.homephone = home;

  // set custkey if not present
  if (!this.custkey) {
    this.custkey = this._id;
  }
  // set phone1 and phone2
  const { isInvalid, phone1, phone2 } = validation.setPhones(this.homephone, this.mobilephone);

  this.isInvalid = isInvalid;
  this.phone1 = phone1 && phone1.length === 9 ? phone1 : '';
  this.phone2 = phone2 && phone2.length === 9 ? phone2 : '';

  // mark invalid
  this.isInvalid = validation.validatePhones(this.phone1, this.phone2);

  // needs to have this conditional otherwise the exported record is marked as a duplicate
  if (!this.isExported) {
    this.findDuplicates()
      .then(isDuplicate => {
        this.isDuplicate = isDuplicate;
        done();
      })
      .catch(err => {
        throw new Error(err);
      });
  } else {
    done();
  }
});

RecordSchema.methods = {
  async getActiveDataset() {
    const dataset = await Dataset.findOne({ campaign: this.campaign, source: this.source, isActive: true });

    if (dataset && !dataset.hasExpired()) return dataset;

    return await new Dataset({ client: this.client, campaign: this.campaign, source: this.source }).save();
  },
  async pushRecordToContactSpace() {
    const dataset = await this.getActiveDataset();

    const record = this.formatForExport();

    const response = await pushRecord(dataset, record);

    // no message on the outcome means that the push was successful
    if (!response.xml.outcome.message) {
      this.isExported = true;
      this.dataset = dataset;
      await this.save();
      return { wasPushed: true };
    } else {
      return { wasPushed: false, error: response.xml.outcome.message };
    }
  },

  formatForExport() {
    const whitelist = [
      'client',
      'campaign',
      'custkey',
      'phone1',
      'phone2',
      'title',
      'firstname',
      'lastname',
      'gender',
      'address1',
      'address2',
      'suburb',
      'state',
      'postcode',
      'mobilephone',
      'homephone',
      'source',
      'sitelabel',
    ];
    const formatted = {};
    const record = this._doc;
    Object.keys(record).forEach(key => {
      if (whitelist.indexOf(key) === -1) return;

      if (key === 'client' || key === 'campaign' || key === 'source') {
        formatted[key] = record[key].name;
      } else {
        formatted[key] = record[key];
      }
    });
    return formatted;
  },
  findDuplicates() {
    const promises = [];
    if (this.mobilephone) promises.push(this.recordExists('mobilephone', this.mobilephone));
    if (this.homephone) promises.push(this.recordExists('homephone', this.homephone));
    if (this.email) promises.push(this.recordExists('email', this.email));
    return Promise.all(promises).spread((mobExists, homeExists, emailExists) => {
      return mobExists || homeExists || emailExists;
    });
  },
  recordExists(field, value) {
    let sixMonths = new Date();
    let month = sixMonths.getMonth();
    sixMonths.setMonth(month - 6);

    const config = {
      campaign: this.campaign,
      created: { $gte: sixMonths },
    };
    config[field] = value;

    return RecordModel.find(config).then(results => {
      return results.length > 0;
    });
  },
};

const RecordModel = mongoose.model('Record', RecordSchema);

export default RecordModel;
