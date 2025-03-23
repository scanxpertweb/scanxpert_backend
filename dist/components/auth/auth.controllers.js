"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReport = exports.deleteUserById = exports.updateUserById = exports.findUserById = exports.findAllUsers = exports.uploadReportFile = exports.registerUser = exports.verifyIdToken = exports.checkUserExists = void 0;
const AuthService = __importStar(require("./auth.services"));
const checkUserExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone } = req.body;
        if (!phone)
            return res.status(400).json({ message: 'Phone number is required' });
        const existingUser = yield AuthService.checkUserOnly(phone);
        return res.status(200).json({ exists: existingUser });
    }
    catch (err) {
        console.error('Check user failed:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.checkUserExists = checkUserExists;
const verifyIdToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken } = req.body;
        const decodedToken = yield AuthService.verifyIdToken(idToken);
        const phone = decodedToken.phone_number;
        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }
        const result = yield AuthService.checkOrCreateUser(phone);
        return res.status(200).json({ exists: result.exists });
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid token', error: err });
    }
});
exports.verifyIdToken = verifyIdToken;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Registering user:', req.body);
        const { phone, name, sex, age } = req.body;
        const user = yield AuthService.checkOrCreateUser(phone, { name, sex, age });
        return res.status(201).json(user);
    }
    catch (err) {
        return res.status(500).json({ message: 'Registration failed', error: err });
    }
});
exports.registerUser = registerUser;
// Controller
const uploadReportFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const file = req.file;
        if (!file || !file.path) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const updatedUser = yield AuthService.updateReport(id, file.path);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'Report uploaded successfully',
            reportUrl: file.path,
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.uploadReportFile = uploadReportFile;
const findAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, page, limit } = req.query;
        const params = { search, page, limit };
        const result = yield AuthService.findAllUsers(params);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.findAllUsers = findAllUsers;
const findUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield AuthService.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.findUserById = findUserById;
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedUser = yield AuthService.updateUserById(id, data);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.updateUserById = updateUserById;
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedUser = yield AuthService.softDeleteUserById(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(deletedUser);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.deleteUserById = deleteUserById;
const deleteReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { report } = req.body;
        const updatedUser = yield AuthService.deleteReport(id, report);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.deleteReport = deleteReport;
