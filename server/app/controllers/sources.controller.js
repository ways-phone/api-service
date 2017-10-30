import BaseController from './base.controller';
import Source from '../models/source';
import _ from 'lodash';

class SourcesController extends BaseController {
  whitelist = ['name'];

  _populate = async (req, res, next) => {
    const { source } = req.params;

    const client = req.currentClient;
    const campaign = req.campaign;
    if (!client) {
      res.status(400).json({ message: 'Client not found.' });
    }
    if (!campaign) {
      res.status(400).json({ message: 'Campaign not found.' });
    }

    try {
      const current = await Source.findOne({
        path: source,
        client,
        campaign,
      });

      if (!current) {
        const err = new Error('Source not found.');
        err.status = 400;
        return next(err);
      }
      req.source = current;
      next();
    } catch (err) {
      next(err);
    }
  };

  search = async (req, res, next) => {
    const user = req.user || req.currentUser;
    const client = req.currentClient.id;
    const campaign = req.campaign.id;

    if (!user) return res.sendStatus(403);
    if (!client) next(new Error('Client does not exist. '));
    if (!campaign) next(new Error('Campaign does not exist. '));

    try {
      const sources = await Source.find({ client, campaign });
      res.status(200).json(sources);
    } catch (err) {
      next(err);
    }
  };

  hide = async (req, res) => {
    if (!req.source) {
      return res.sendStatus(404);
    }
    const current = await Source.findById(req.source.id);
    current.isHidden = true;
    res.status(200).json(await current.save());
  };

  create = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);

    if (_.isEmpty(params)) {
      return res.status(406).json({ message: 'Source cannot be empty.' });
    }

    const user = req.user || req.currentUser;
    const client = req.currentClient.id;
    const campaign = req.campaign.id;

    if (!user) return res.sendStatus(403);
    if (!client) next(new Error('Client does not exist. '));
    if (!campaign) next(new Error('Campaign does not exist. '));

    const newSource = new Source({
      ...params,
      client,
      campaign,
      creator: user.username,
    });

    try {
      const savedSource = await newSource.save();
      res.status(201).json(savedSource);
    } catch (err) {
      err.status = 400;
      next(err);
    }
  };
}

export default new SourcesController();
