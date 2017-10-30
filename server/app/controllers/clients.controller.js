import BaseController from './base.controller';
import Client from '../models/client';
import _ from 'lodash';

class ClientsController extends BaseController {
  whitelist = ['name'];

  search = async (req, res, next) => {
    const isHidden = req.query.isHidden || undefined;
    try {
      if (isHidden !== undefined) {
        res.json(await Client.find({ isHidden }));
      } else {
        res.json(await Client.find());
      }
    } catch (err) {
      next(err);
    }
  };

  _populate = async (req, res, next) => {
    const { client } = req.params;

    try {
      const current = await Client.findOne({ path: client });

      if (!current) {
        const err = new Error('Client not found.');
        err.status = 404;
        return next(err);
      }
      req.currentClient = current;
      next();
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);

    const user = req.user || req.currentUser;

    if (!user) {
      return res.sendStatus(403);
    }

    if (_.isEmpty(params)) return res.status(400).json({ message: 'Invalid Client.' });

    let newClient = new Client({
      ...params,
      creator: user.username,
    });

    try {
      const savedClient = await newClient.save();
      res.status(201).json(savedClient);
    } catch (err) {
      err.status = 400;
      next(err);
    }
  };

  fetch = async (req, res) => {
    if (!req.currentClient) {
      return res.sendStatus(404);
    }

    res.json(req.currentClient);
  };

  hide = async (req, res, next) => {
    if (!req.currentClient) {
      return res.sendStatus(404);
    }
    try {
      const current = await Client.findById(req.currentClient.id);
      const updated = await Client.findByIdAndUpdate(req.currentClient.id, { $set: { isHidden: !current.isHidden } }, { new: true });
      res.status(200).json(await updated);
    } catch (err) {
      return next(err);
    }
  };

  update = async (req, res, next) => {
    const newAttributes = this.filterParams(req.body, this.whitelist);
    const user = req.user || req.currentUser;
    if (!user) {
      return res.sendStatus(403);
    }

    if (!req.currentClient) {
      return res.status(400).json({ message: 'Client not found' });
    }

    try {
      const current = await Client.findById(req.currentClient.id);
      current.name = newAttributes.name;

      res.status(200).json(await current.save());
    } catch (err) {
      next(err);
    }
  };
}

export default new ClientsController();
