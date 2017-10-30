import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SourceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A source name is required.'],
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
      required: [true, 'A Source must be associated with a Client.'],
    },
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'A Source must be associated with a Campaign.'],
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

SourceSchema.index({ name: 1, campaign: 1 }, { unique: true });

SourceSchema.set('toJSON', {
  transform(doc, obj) {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;

    return obj;
  },
});

SourceSchema.pre('save', function(done) {
  this.path = this.name.replace(/\s/g, '_');
  done();
});

const SourceModel = mongoose.model('Source', SourceSchema);

export default SourceModel;
