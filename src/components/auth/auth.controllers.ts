import { Request, Response } from 'express';
import * as AuthService from './auth.services';
import { uploadToCloudinary } from '../utils/cloudinary';

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

// export const registerUser = async (req: Request, res: Response) => {
//   try {
//     const { phone, name, sex, age } = req.body;

//     if (!phone || !name || !sex || !age) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const reportFiles = req.files as Express.Multer.File[] | undefined;

//     let reportUrls: string[] = [];

//     if (reportFiles && reportFiles.length > 0) {
//       const uploadPromises = reportFiles.map((file) =>
//         uploadToCloudinary(file.buffer, `${Date.now()}_${file.originalname}`)
//       );
//       reportUrls = await Promise.all(uploadPromises);
//     }

//     const user = await AuthService.checkOrCreateUser(phone, {
//       name,
//       sex,
//       age: Number(age),
//       report: reportUrls,
//     });

//     return res.status(201).json(user);
//   } catch (err) {
//     console.error('Registration failed:', err);
//     return res.status(500).json({ message: 'Registration failed', error: (err as Error).message });
//   }
// };



export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log("🔹 Incoming request body:", req.body);

    // Extract user details
    const { phone, name, sex, age } = req.body;

    // Validate required fields
    if (!phone || !name || !sex || !age) {
      console.error("❌ Missing required fields:", { phone, name, sex, age });
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("✅ Fields validated successfully.");

    // Handle file uploads
    const reportFiles = req.files as Express.Multer.File[] | undefined;
    let reportUrls: string[] = [];

    if (reportFiles && reportFiles.length > 0) {
      console.log("📁 Uploading files to Cloudinary:", reportFiles.length);

      try {
        const uploadPromises = reportFiles.map((file) =>
          uploadToCloudinary(file.buffer, `${Date.now()}_${file.originalname}`)
        );
        reportUrls = await Promise.all(uploadPromises);
        console.log("✅ File upload successful:", reportUrls);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload failed:", uploadError);
        return res.status(500).json({
          message: "File upload failed",
          error: (uploadError as Error).message,
        });
      }
    }

    console.log("🔹 Creating or checking user in database...");

    // Check if user exists or create new user
    let user;
    try {
      user = await AuthService.checkOrCreateUser(phone, {
        name,
        sex,
        age: Number(age),
        report: reportUrls,
      });
      console.log("✅ User created successfully:", user);
    } catch (dbError) {
      console.error("❌ Database operation failed:", dbError);
      return res.status(500).json({
        message: "Database operation failed",
        error: (dbError as Error).message,
      });
    }

    // Send response
    return res.status(201).json(user);
  } catch (err) {
    console.error("❌ Unexpected error during registration:", err);
    return res.status(500).json({
      message: "Registration failed due to an unexpected error",
      error: `${(err as Error).message}`,
    });
  }
};



// Controller
export const uploadReportFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Upload each file to Cloudinary
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file.buffer, `${Date.now()}_${file.originalname}`)
    );
    const reportUrls = await Promise.all(uploadPromises);

    // Replace old report(s) with the new ones
    const updatedUser = await AuthService.updateReport(id, reportUrls);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Reports replaced successfully',
      reportUrls,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
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
