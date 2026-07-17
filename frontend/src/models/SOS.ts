import mongoose, { Schema, Document } from 'mongoose';

export interface ISOS extends Document {
  senderName: string;
  lat: number;
  lon: number;
  message: string;
  timestamp: string;
}

const SOSSchema: Schema = new Schema({
  senderName: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true },
});

export default mongoose.models.SOS || mongoose.model<ISOS>('SOS', SOSSchema);
