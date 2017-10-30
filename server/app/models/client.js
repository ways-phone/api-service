import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'A client must have a name.'],
  },
  path: String,
  creator: {
    type: String,
    required: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
});

ClientSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    delete obj._id;
    delete obj.__v;

    return obj;
  },
});

ClientSchema.path('name').validate((name, respond) => {
  ClientModel.findOne({ name })
    .then(client => {
      respond(client ? false : true);
    })
    .catch(() => {
      respond(false);
    });
}, 'Client already created.');

ClientSchema.pre('save', function(done) {
  this.path = this.name.replace(/\s/g, '_');
  done();
});

const ClientModel = mongoose.model('Client', ClientSchema);

export default ClientModel;
