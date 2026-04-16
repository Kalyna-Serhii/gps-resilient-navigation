import mongoose from 'mongoose';

const coordinateSchema = {
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
};

const routeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    origin: coordinateSchema,
    destination: coordinateSchema,
    routes: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

routeSchema.index({ userId: 1, createdAt: -1 });

const RouteModel = mongoose.model('Route', routeSchema);

export default RouteModel;
