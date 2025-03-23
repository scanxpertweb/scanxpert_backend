import admin from '../firebase/admin';
import * as UserRepo from './auth.repository';
import { findRole } from '../role/role.repository';
import { IUser } from '../collections/auth.model';

export const verifyIdToken = async (idToken: string) => {
  return await admin.auth().verifyIdToken(idToken);
};

export const checkOrCreateUser = async (
  phone: string,
  data?: { name: string; age: number; sex: string }
) => {
  const existingUser = await UserRepo.findUserByPhone(phone);
  if (existingUser) return { exists: true, user: existingUser };

  if (!data) throw new Error("User data required for registration");

  const role = await findRole();

  // Find the role for 'user' and get a single _id
  const userRole = role.find((r) => r.name === "user"); 
  const roleId = userRole ? userRole._id : undefined; 

  if (!roleId) throw new Error("User role not found"); 

  // Create new user
  const newUser: IUser = await UserRepo.createUser({
    phone,
    name: data.name,
    age: data.age,
    sex: data.sex,
    report: [],
    role: roleId, // Pass a single ID
  });

  return { exists: false, user: newUser };
};



export const checkUserOnly = async (phone: string) => {
  const existingUser = await UserRepo.findUserByPhone(phone);
  return !!existingUser;
};

export const updateReport = async (id: string, report: string) => {
  const updatedUser = await UserRepo.updateReport(id, [report]);
  return updatedUser;
}

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
  return await UserRepo.updateUserById(id, data);
}

export const deleteReport = async (id: string, report: string) => {
  return await UserRepo.deleteReport(id, report);
}