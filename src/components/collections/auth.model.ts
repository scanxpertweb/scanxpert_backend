// models/User.ts
import mongoose, { model } from 'mongoose';
import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  phone: string;
  name: string;
  sex: string;
  age: number;
  report: string[];
  is_deleted: boolean;
  role?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  phone: { type: String, required: true },
  name: { type: String, required: true },
  sex: { type: String, required: true },
  age: { type: Number, required: true },
  report: [{ type: String }],
  role: { type: Types.ObjectId, ref: 'Role' },
  is_deleted: {type: Boolean, default: false},
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);

