import e from "express";
import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: false, default: "user" },
}, { timestamps: true });

export const Role = mongoose.model("Role", RoleSchema);