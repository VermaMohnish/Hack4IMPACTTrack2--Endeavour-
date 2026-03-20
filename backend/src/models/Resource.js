import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Ambulance', 'Helicopter', 'FireTruck']
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: {
    type: String,
    required: true,
    enum: ['AVAILABLE', 'BUSY']
  },
  sectorId: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Resource', ResourceSchema);
