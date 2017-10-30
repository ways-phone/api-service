import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A Name is required'],
  },
  contactspaceId: {
    type: Number,
    required: [true, 'A Contact Space ID is required.'],
    unique: true,
  },
  path: {
    type: String,
  },
  creator: {
    type: String,
    required: [true, 'A campaign requires a creator.'],
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'A Campaign must be created for a Client.'],
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
});

CampaignSchema.index({ name: 1, client: 1 }, { unique: true });

CampaignSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    delete obj._id;
    delete obj.__v;

    return obj;
  },
});

// CampaignSchema.path('name').validate((name, respond) => {
//   CampaignModel.findOne({ name })
//     .then(campaign => {
//       respond(campaign ? false : true);
//     })
//     .catch(() => {
//       respond(false);
//     });
// }, 'Campaign already created.');

CampaignSchema.pre('save', function(done) {
  this.path = this.name.replace(/\s/g, '_');
  done();
});

const CampaignModel = mongoose.model('Campaign', CampaignSchema);

export default CampaignModel;
