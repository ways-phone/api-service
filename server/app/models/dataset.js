import mongoose from 'mongoose';
import { createDatasetInContactSpace } from '../vendor/contactspace';
import { formatDate } from '../utils/date-formatter';
import Client from '../models/client';
import Campaign from '../models/campaign';
import Source from '../models/source';
import { notifyAdmins } from '../utils/mailer';
import { formatTimestamp } from '../utils/date-formatter';

const Schema = mongoose.Schema;
const DatasetSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'A dataset must be associated with a client.'],
  },
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: [true, 'A dataset must be associated with a campaign.'],
  },
  source: {
    type: Schema.Types.ObjectId,
    ref: 'Source',
    required: [true, 'A dataset must be associated with a source.'],
  },
  name: {
    type: String,
    unique: true,
  },
  ID: {
    type: Number,
  },
  expires: {
    type: Date,
    default: () => {
      let today = new Date();
      today.setDate(today.getDate() + (7 - today.getDay()) % 7 + 1);
      today.setHours(0, 0, 0);
      return today;
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

DatasetSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    delete obj._id;
    delete obj.__v;
    return obj;
  },
});

DatasetSchema.pre('save', async function(next) {
  try {
    this.name = await this._setName();

    // WARNING THE FOLLOWING LINE WILL CALL A THIRD PARTY API
    this.ID = await this._setID();

    this._notify(this.name, this.ID);

    await DatasetModel.update(
      { campaign: this.campaign, source: this.source, isActive: true },
      { $set: { isActive: false } },
      { multi: true }
    );

    return next();
  } catch (err) {
    return next(err);
  }
});

DatasetSchema.methods = {
  hasExpired() {
    const today = new Date();
    return today > this.expires;
  },

  async _setName() {
    const campaign = await Campaign.findById(this.campaign);
    const client = await Client.findById(this.client);
    const source = await Source.findById(this.source);

    let weekCommence = new Date(this.expires.getFullYear(), this.expires.getMonth(), this.expires.getDate() - 7);

    return await `${client.name} ${campaign.name} - ${source.name}:: W/C ${formatDate(weekCommence)}`;
  },

  async _setID() {
    const campaign = await Campaign.findById(this.campaign);
    return await createDatasetInContactSpace(campaign, this.name);
  },

  async _notify(name, id) {
    if (!name || !id) return;

    const subject = `${name} has been created`;
    const body = `Created at ${formatTimestamp(Date.now())} with ID: ${id}`;
    await notifyAdmins(subject, body);
  },
};

const DatasetModel = mongoose.model('Dataset', DatasetSchema);

export default DatasetModel;
