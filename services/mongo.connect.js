import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
};

function connectDB() {
  return new Promise((resolve, reject) => {
    const mongoURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority`;
    mongoose
      .connect(mongoURL, mongoOptions)
      .then((conn) => {
        console.log('Connected');
        resolve(conn);
      })
      .catch((error) => reject(error));
  });
}

export default connectDB;
