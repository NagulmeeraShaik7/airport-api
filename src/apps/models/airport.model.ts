import mongoose, { Document, Schema } from 'mongoose';
import { ICity } from './city.model';
import { ICountry } from './country.model';

export interface IAirport extends Document {
  id: number;
  icao_code: string;
  iata_code: string;
  name: string;
  type: string;
  city_id: number;
  country_id: number;
  continent_id: number;
  website_url?: string;
  created_at: Date;
  updated_at: Date;
  latitude_deg: number;
  longitude_deg: number;
  elevation_ft?: number;
  wikipedia_link?: string;
  city?: ICity; // Populated field
  country?: ICountry; // Populated field
}

const AirportSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  icao_code: { type: String, required: true },
  iata_code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  city_id: { type: Number, required: true, ref: 'City' }, // Reference to City model
  country_id: { type: Number, required: true, ref: 'Country' }, // Reference to Country model
  continent_id: { type: Number, required: true },
  website_url: { type: String, nullable: true },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
  latitude_deg: { type: Number, required: true },
  longitude_deg: { type: Number, required: true },
  elevation_ft: { type: Number, nullable: true },
  wikipedia_link: { type: String, nullable: true },
}, { _id: false });

export const Airport = mongoose.model<IAirport>('Airport', AirportSchema);