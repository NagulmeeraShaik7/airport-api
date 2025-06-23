import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ERROR_MESSAGES, DATA_SOURCE_STRINGS } from './infrastructure/constants';

dotenv.config();

/**
 * Establishes connection to MongoDB database
 * @returns Promise resolving to void
 * @throws Error if connection fails
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env[DATA_SOURCE_STRINGS.MONGO_URI_ENV];
    if (!mongoUri) {
      throw new Error(ERROR_MESSAGES.MONGO_URI_NOT_DEFINED);
    }
    await mongoose.connect(mongoUri);
    console.log(DATA_SOURCE_STRINGS.MONGO_CONNECTION_SUCCESS);
  } catch (error) {
    console.error(DATA_SOURCE_STRINGS.MONGO_CONNECTION_ERROR_LOG, error);
    process.exit(1);
  }
};

/**
 * Disconnects from MongoDB database
 * @returns Promise resolving to void
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log(DATA_SOURCE_STRINGS.MONGO_DISCONNECTION_SUCCESS);
  } catch (error) {
    console.error(DATA_SOURCE_STRINGS.MONGO_DISCONNECTION_ERROR_LOG, error);
  }
};