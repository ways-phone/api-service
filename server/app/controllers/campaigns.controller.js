import BaseController from './base.controller';
import Campaign from '../models/campaign';
import _ from 'lodash';

class CampaignsController extends BaseController {
  whitelist = ['name', 'contactspaceId'];

  search = async (req, res, next) => {
    try {
      res.json(await Campaign.find());
    } catch (err) {
      next(err);
    }
  };

  _populate = async (req, res, next) => {
    const { campaign } = req.params;
    const client = req.currentClient;
    if (!client) {
      res.status(400).json({ message: 'Client not found.' });
    }

    try {
      const current = await Campaign.findOne({
        path: campaign,
        client: client,
      });

      if (!current) {
        const err = new Error('Campaign not found.');
        err.status = 404;
        return next(err);
      }

      req.campaign = current;
      next();
    } catch (err) {
      next(err);
    }
  };

  fetch = async (req, res) => {
    if (!req.currentClient) {
      return res.sendStatus(404);
    }
    const isHidden = req.query.isHidden || undefined;
    let config = {};
    if (isHidden !== undefined) {
      config = { client: req.currentClient, isHidden };
    } else {
      config = { client: req.currentClient };
    }
    res.json(
      await Campaign.find(config)
        .lean()
        .populate('client')
    );
  };

  hide = async (req, res) => {
    if (!req.currentClient) {
      return res.sendStatus(404);
    }

    const current = await Campaign.findById(req.campaign.id);
    const updated = await Campaign.findByIdAndUpdate(
      req.campaign.id,
      { $set: { isHidden: !current.isHidden } },
      { new: true }
    );
    res.status(200).json(await updated);
  };

  create = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);

    const user = req.user || req.currentUser;
    const client = req.currentClient;

    if (!user || !client) {
      return res.sendStatus(403);
    }

    if (_.isEmpty(params)) return res.status(400).json({ message: 'Invalid campaign.' });

    let newCampaign = new Campaign({
      ...params,
      client,
      creator: user.username,
    });

    try {
      const savedCampaign = await newCampaign.save();

      res.status(201).json(savedCampaign);
    } catch (err) {
      err.status = 400;
      await Campaign.findByIdAndRemove(newCampaign.id);
      next(err);
    }
  };
}

export default new CampaignsController();
