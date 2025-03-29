import admin from '../firebase/admin';
import * as UserRepo from './auth.repository';
import { findRole } from '../role/role.repository';
import { IUser } from '../collections/auth.model';
import mongoose from 'mongoose';

export const verifyIdToken = async (idToken: string) => {
  return await admin.auth().verifyIdToken(idToken);
};

export const checkOrCreateUser = async (
  phone: string,
  data?: { name: string; age: number; sex: string, role?:string, report?: string[], }
) => {
  const existingUser = await UserRepo.findUserByPhone(phone);
  if (existingUser) return { exists: true, user: existingUser };

  if (!data) throw new Error("User data required for registration");

  const role = await findRole();

  // Find the role for 'user' and get a single _id
  const userRole = role.find((r) => r.name === (data.role || "patient")); 
  const roleId = userRole?._id || new mongoose.Types.ObjectId('67e19486cae62de981c6062b');

  if (!roleId) throw new Error("User role not found"); 

  // Create new user
  const newUser: IUser = await UserRepo.createUser({
    phone,
    name: data.name,
    age: data.age,
    sex: data.sex,
    report: data.report || [],
    role: roleId, // Pass a single ID
  });

  return { exists: false, user: newUser };
};



export const checkUserOnly = async (phone: string) => {
  const existingUser = await UserRepo.findUserByPhone(phone);
  return !!existingUser;
};

export const updateReport = async (id: string, reportUrl: string[]) => {
  return await UserRepo.updateReport(id, reportUrl);
};

export const findAllUsers = async (params: any) => {
  return await UserRepo.findAllUsers(params);
}

export const findUserById = async (id: string) => {
  return await UserRepo.findUserById(id);
}

export const softDeleteUserById= async (id:string)=>{
  return await UserRepo.softDeleteUserById(id);
}

export const updateUserById = async (id: string, data: Partial<IUser>) => {
  try {
    const updatedUser = await UserRepo.updateUserById(id, data);
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const deleteReport = async (id: string, report: string) => {
  return await UserRepo.deleteReport(id, report);
}