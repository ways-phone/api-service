import mongoose from 'mongoose';
import Constants from './config/constants';
import fs from 'fs';
mongoose.Promise = global.Promise;

const options = {
  useMongoClient: true,
  sslCA: [fs.readFileSync('/etc/ssl/mongodb/mongodb-client-cert.crt')],
  sslCert: fs.readFileSync('/etc/ssl/mongodb/mongodb-client.pem'),
  sslKey: fs.readFileSync('/etc/ssl/mongodb/mongodb-client.pem'),
  sslPass: Constants.mongo.pass,
  ssl: true,
};

mongoose.connect(Constants.mongo.uri, options);

mongoose.connection.on('error', err => {
  throw err;
});
// mongoose.connection.on('connected', () => {
//   setPartialIndexes();
// });
