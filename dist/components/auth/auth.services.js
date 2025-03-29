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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReport = exports.updateUserById = exports.softDeleteUserById = exports.findUserById = exports.findAllUsers = exports.updateReport = exports.checkUserOnly = exports.checkOrCreateUser = exports.verifyIdToken = void 0;
const admin_1 = __importDefault(require("../firebase/admin"));
const UserRepo = __importStar(require("./auth.repository"));
const role_repository_1 = require("../role/role.repository");
const mongoose_1 = __importDefault(require("mongoose"));
const verifyIdToken = (idToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield admin_1.default.auth().verifyIdToken(idToken);
});
exports.verifyIdToken = verifyIdToken;
const checkOrCreateUser = (phone, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield UserRepo.findUserByPhone(phone);
        if (existingUser)
            return { exists: true, user: existingUser };
        if (!data)
            throw new Error("User data required for registration");
        const role = yield (0, role_repository_1.findRole)();
        // Find the role for 'user' and get a single _id
        const userRole = role.find((r) => r.name === (data.role || "patient"));
        const roleId = (userRole === null || userRole === void 0 ? void 0 : userRole._id) || new mongoose_1.default.Types.ObjectId('67e19486cae62de981c6062b');
        if (!roleId)
            throw new Error("User role not found");
        // Create new user
        const newUser = yield UserRepo.createUser({
            phone,
            name: data.name,
            age: data.age,
            sex: data.sex,
            report: data.report || [],
            role: roleId, // Pass a single ID
        });
        return { exists: false, user: newUser };
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.checkOrCreateUser = checkOrCreateUser;
const checkUserOnly = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield UserRepo.findUserByPhone(phone);
    return !!existingUser;
});
exports.checkUserOnly = checkUserOnly;
const updateReport = (id, reportUrl) => __awaiter(void 0, void 0, void 0, function* () {
    return yield UserRepo.updateReport(id, reportUrl);
});
exports.updateReport = updateReport;
const findAllUsers = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return yield UserRepo.findAllUsers(params);
});
exports.findAllUsers = findAllUsers;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield UserRepo.findUserById(id);
});
exports.findUserById = findUserById;
const softDeleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield UserRepo.softDeleteUserById(id);
});
exports.softDeleteUserById = softDeleteUserById;
const updateUserById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield UserRepo.updateUserById(id, data);
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.updateUserById = updateUserById;
const deleteReport = (id, report) => __awaiter(void 0, void 0, void 0, function* () {
    return yield UserRepo.deleteReport(id, report);
});
exports.deleteReport = deleteReport;
