import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import helmet from 'helmet';
import routes from './routes';
import Constants from './config/constants';
import seed from './utils/seeder';
import jsonErrorHandler from './middleware/jsonErrorHandler';
import path from 'path';
import cors from 'cors';
const app = express();

app.use(helmet());

if (!Constants.envs.test) {
  app.use(morgan('dev'));
}

if (Constants.envs.production) {
  seed();
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jsonErrorHandler());
app.use(methodOverride());

app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap')));
app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery')));
app.use('/content', express.static(path.join(__dirname, '../content')));
app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use(Constants.apiPrefix, routes);

app.listen(Constants.port, () => {
  // eslint-disable-next-line no-console
  console.log(`
        Port: ${Constants.port}
        Env: ${Constants.env}
    `);
});

export default app;
