import mongoose, { Document, Schema } from 'mongoose';

export interface ICountry extends Document {
  id: number;
  name: string;
  alt_name?: string;
  country_code_two: string;
  country_code_three: string;
  flag_app?: string;
  mobile_code: number;
  continent_id: number;
  country_flag?: string;
}

const CountrySchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  alt_name: { type: String, nullable: true },
  country_code_two: { type: String, required: true },
  country_code_three: { type: String, required: true },
  flag_app: { type: String, nullable: true },
  mobile_code: { type: Number, required: true },
  continent_id: { type: Number, required: true },
  country_flag: { type: String, nullable: true },
}, { _id: false }); // Do not create default _id, use 'id' as the primary key equivalent

export const Country = mongoose.model<ICountry>('Country', CountrySchema);