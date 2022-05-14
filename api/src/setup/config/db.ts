import mongoose from 'mongoose';
import { MONGO_URL, NODE_ENV } from '../constants';

const mongoConnection = {
  isConnected: 0
}

export const connect = async () => {
  if (mongoConnection.isConnected) {
    console.log('Already connected');
    return;
  }

  if (mongoose.connections.length > 0) {
    mongoConnection.isConnected = mongoose.connections[0]!.readyState;

    if (mongoConnection.isConnected === 1) {
      console.log('Using previous connection');
      return;
    }

    await mongoose.disconnect();
  }

  await mongoose.connect(MONGO_URL);
  mongoConnection.isConnected = 1;
  console.log('Connected to MongoDB:', MONGO_URL);
}

export const disconnect = async () => {

  if (NODE_ENV === 'development') return;

  if (mongoConnection.isConnected === 0) return;

  await mongoose.disconnect();
  mongoConnection.isConnected = 0;

  console.log('Disconnecting from MongoDB');
}