import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true },
);

tokenSchema.index({ refreshToken: 1 });

const TokenModel = mongoose.model('Token', tokenSchema);

export default TokenModel;
