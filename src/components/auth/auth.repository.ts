import mongoose from 'mongoose';
import { User } from '../collections/auth.model';


interface QueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const findUserByPhone = async (phone: string) => {
  return await User.findOne({ phone, is_deleted: false });
};

export const createUser = async (data: {
  phone: string;
  name: string;
  sex: string;
  age: number;
  report?: string[];
  role?: mongoose.Types.ObjectId;
}) => {
  return await User.create(data);
};

export const findUserById = async (id: string) => {
  try {
    const user = await User.findById(id).populate({
      path: 'role',
      model: 'Role',
    });
    return user;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const findAllUsers = async (params: QueryParams = {}) => {
  try {
    const {
      search = '',
      page = 1,
      limit = 10,
    } = params;

    const query: any = {
      is_deleted: false,
    };

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const skip = (page - 1) * limit;

    const data = await User.find(query)
      .populate({ path: 'role', model: 'Role' })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    return {
      data,
      total,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};


export const updateUserById = async (
  id: string,
  data: Partial<{
    name: string;
    age: number;
    sex: string;
    report: string[];
  }>
) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};


export const softDeleteUserById = async (id: string) => {
  try {
    const deletedUser = await User.findByIdAndUpdate(
      id,
      { $set: { is_deleted: true } },
      { new: true }
    );

    if (!deletedUser) {
      throw new Error('User not found');
    }

    return deletedUser;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};



// make a seprate function to update only report 

// src/repo/UserRepo.ts

export const updateReport = async (id: string, newReportUrl: string[]) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { report: newReportUrl } }, // Replaces the entire report array
      { new: true, runValidators: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};


// make a function to delete a report from the report array

export const deleteReport = async (id: string, reportUrl: string) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $pull: { report: reportUrl } }, // Removes the matching report URL from the array
      { new: true, runValidators: true }
    );

    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to delete report: ${(error as Error).message}`);
  }
};


