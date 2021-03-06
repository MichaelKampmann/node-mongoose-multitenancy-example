import mongoose from 'mongoose';

const tenantSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  passworde: {
    type: String,
  },
  companyName: {
    type: String,
    unique: true,
  },
});

export default tenantSchema;
