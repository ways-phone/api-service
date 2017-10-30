import { Router } from 'express';

import MetaController from './controllers/meta.controller';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';
import ClientsController from './controllers/clients.controller';
import RecordsController from './controllers/records.controller';
import CampaignsController from './controllers/campaigns.controller';
import SourcesController from './controllers/sources.controller';

import authenticate from './middleware/authenticate';
import getUser from './middleware/get-user';
import accessControl from './middleware/access-control';
import errorHandler from './middleware/error-handler';

const routes = new Router();

routes.get('/', MetaController.index);

routes.post('/auth/login', AuthController.login);
routes.post('/auth/change-password', authenticate, UsersController.changePassword);

routes.get('/users', accessControl('admin'), UsersController.search);
routes.post('/users', getUser, UsersController.create);
routes.get('/users/me', authenticate, UsersController.fetch);

routes.get('/users/:username', accessControl('admin'), UsersController._populate, UsersController.fetch);

routes.get('/clients', authenticate, ClientsController.search);
routes.post('/clients', accessControl('admin'), ClientsController.create);

routes.get('/clients/:client', authenticate, ClientsController._populate, CampaignsController.fetch);
routes.put('/clients/:client', accessControl('admin'), ClientsController._populate, ClientsController.update);

routes.post('/clients/:client', accessControl('admin'), ClientsController._populate, CampaignsController.create);
routes.delete('/clients/:client', accessControl('admin'), ClientsController._populate, ClientsController.hide);

routes.post(
  '/clients/:client/:campaign',
  authenticate,
  ClientsController._populate,
  CampaignsController._populate,
  RecordsController.create
);

routes.delete(
  '/clients/:client/:campaign',
  authenticate,
  ClientsController._populate,
  CampaignsController._populate,
  CampaignsController.hide
);

routes.get(
  '/clients/:client/:campaign',
  authenticate,
  ClientsController._populate,
  CampaignsController._populate,
  SourcesController.search
);
routes.get(
  '/clients/:client/:campaign/records',
  accessControl('admin'),
  ClientsController._populate,
  CampaignsController._populate,
  RecordsController.retrieve
);

routes.post('/records/search', accessControl('admin'), RecordsController.search);

routes.post(
  '/clients/:client/:campaign/source',
  authenticate,
  ClientsController._populate,
  CampaignsController._populate,
  SourcesController.create
);

routes.delete(
  '/clients/:client/:campaign/source',
  accessControl('admin'),
  ClientsController._populate,
  CampaignsController._populate,
  SourcesController.hide
);

routes.use(errorHandler);

export default routes;
