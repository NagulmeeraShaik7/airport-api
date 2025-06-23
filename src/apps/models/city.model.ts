import mongoose, { Document, Schema } from 'mongoose';
import { ICountry } from './country.model';

export interface ICity extends Document {
  id: number;
  name: string;
  country_id: number;
  is_active: boolean;
  lat: number;
  long: number;
  country?: ICountry; // Populated field
}

const CitySchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  country_id: { type: Number, required: true, ref: 'Country' }, // Reference to Country model
  is_active: { type: Boolean, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
}, { _id: false });

export const City = mongoose.model<ICity>('City', CitySchema);