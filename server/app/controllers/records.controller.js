import BaseController from './base.controller';
import Record from '../models/record';
import Source from '../models/source';

import _ from 'lodash';

class RecordsController extends BaseController {
  whitelist = [
    'custkey',
    'title',
    'firstname',
    'lastname',
    'gender',
    'address1',
    'address2',
    'suburb',
    'state',
    'postcode',
    'email',
    'mobilephone',
    'homephone',
    'source',
    'sitelabel',
  ];

  _format(record) {
    delete record.__v;
    record.id = record._id;
    delete record._id;
    record.client = record.client.name;
    record.campaign = record.campaign.name;
    record.source = record.source.name;
    if (record.dataset) record.dataset = record.dataset.name;
    else record.dataset = '';
    return record;
  }

  search = async (req, res, next) => {
    const user = req.user || req.currentUser;

    if (!user) return res.sendStatus(403);

    const params = req.body;

    if (params.source) {
      const source = await Source.findOne({ name: params.source });
      if (source) {
        params.source = source.id;
      } else {
        return res.status(406).json({ message: 'That source does not exist.' });
      }
    }

    if (_.isEmpty(params)) {
      return res.status(406).json({ message: 'Search cannot be empty.' });
    }

    try {
      const records = await Record.find({ ...params })
        .lean()
        .populate('client campaign dataset source');
      const formatted = records.map(this._format);
      res.status(200).json(formatted);
    } catch (err) {
      err.status = 400;
      next(err);
    }
  };

  retrieve = async (req, res, next) => {
    const user = req.user || req.currentUser;
    const client = req.currentClient;
    const campaign = req.campaign;

    if (!user) return res.sendStatus(403);
    if (!client) next(new Error('Client does not exist. '));
    if (!campaign) next(new Error('Campaign does not exist. '));

    try {
      const records = await Record.find({ client, campaign })
        .lean()
        .populate('client campaign dataset source');

      const formatted = records.map(this._format);

      res.status(200).json(formatted);
    } catch (err) {
      err.status = 400;
      next(err);
    }
  };

  create = async (req, res, next) => {
    const params = req.body;

    if (_.isEmpty(params)) {
      return res.status(406).json({ message: 'Record cannot be empty.' });
    }

    if (!params.source) {
      return res.status(400).json({ message: 'A Record must contain a source' });
    }

    const user = req.user || req.currentUser;
    const client = req.currentClient;
    const campaign = req.campaign;

    const source = await Source.findOne({ campaign, name: params.source });

    if (!user) return res.sendStatus(403);
    if (!client) next(new Error('Client does not exist. '));
    if (!campaign) next(new Error('Campaign does not exist. '));
    if (!source) next(new Error(`The source: ${params.source} does not exist`));

    let newRecord = new Record({
      ...params,
      client,
      campaign,
      creator: user.username,
      source,
    });

    try {
      const savedRecord = await newRecord.save();
      res.status(201).json({ id: savedRecord.id, valid: !savedRecord.isInvalid, duplicate: !!savedRecord.isDuplicate });

      // WARNING: THE FOLLOWING LINES, IF UNCOMMENTED WILL PUSH RECORDS TO A THIRD PARTY API

      if (!savedRecord.isInvalid && !savedRecord.isDuplicate) {
        await savedRecord.pushRecordToContactSpace();
      }
    } catch (err) {
      err.status = 400;
      next(err);
    }
  };
}

export default new RecordsController();
