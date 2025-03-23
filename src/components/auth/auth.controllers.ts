import { Request, Response } from 'express';
import * as AuthService from './auth.services';

export const checkUserExists = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    const existingUser = await AuthService.checkUserOnly(phone);
    return res.status(200).json({ exists: existingUser });
  } catch (err) {
    console.error('Check user failed:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const verifyIdToken = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await AuthService.verifyIdToken(idToken);
    const phone = decodedToken.phone_number;
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const result = await AuthService.checkOrCreateUser(phone);
    return res.status(200).json({ exists: result.exists });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log('Registering user:', req.body);
    const { phone, name, sex, age } = req.body;
    const user = await AuthService.checkOrCreateUser(phone, { name, sex, age });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err });
  }
};


// Controller
export const uploadReportFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file as Express.Multer.File;

    if (!file || !file.path) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const updatedUser = await AuthService.updateReport(id, file.path);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Report uploaded successfully',
      reportUrl: file.path,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};


export const findAllUsers = async (req: Request, res: Response) => {
  try {
    const { search, page, limit } = req.query;
    const params = { search, page, limit };
    const result = await AuthService.findAllUsers(params);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
}

export const findUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await AuthService.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
}

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedUser = await AuthService.updateUserById(id, data);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
}

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await AuthService.softDeleteUserById(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(deletedUser);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
}

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { report } = req.body;
    const updatedUser = await AuthService.deleteReport(id, report);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
}
