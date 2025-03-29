"use strict";
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
exports.deleteReport = exports.updateReport = exports.softDeleteUserById = exports.updateUserById = exports.findAllUsers = exports.findUserById = exports.createUser = exports.findUserByPhone = void 0;
const auth_model_1 = require("../collections/auth.model");
const findUserByPhone = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    return yield auth_model_1.User.findOne({ phone, is_deleted: false });
});
exports.findUserByPhone = findUserByPhone;
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield auth_model_1.User.create(data);
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.createUser = createUser;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield auth_model_1.User.findById(id).populate({
            path: 'role',
            model: 'Role',
        });
        return user;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.findUserById = findUserById;
const findAllUsers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (params = {}) {
    try {
        const { search = '', page = 1, limit = 10, } = params;
        const query = {
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
        const data = yield auth_model_1.User.find(query)
            .populate({ path: 'role', model: 'Role' })
            .skip(skip)
            .limit(limit);
        const total = yield auth_model_1.User.countDocuments(query);
        return {
            data,
            total,
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.findAllUsers = findAllUsers;
const updateUserById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield auth_model_1.User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).populate({
            path: 'role',
            model: 'Role',
        });
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
const softDeleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield auth_model_1.User.findByIdAndUpdate(id, { $set: { is_deleted: true } }, { new: true });
        if (!deletedUser) {
            throw new Error('User not found');
        }
        return deletedUser;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.softDeleteUserById = softDeleteUserById;
// make a seprate function to update only report 
// src/repo/UserRepo.ts
const updateReport = (id, newReportUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield auth_model_1.User.findByIdAndUpdate(id, { $set: { report: newReportUrl } }, // Replaces the entire report array
        { new: true, runValidators: true });
        return updatedUser;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.updateReport = updateReport;
// make a function to delete a report from the report array
const deleteReport = (id, reportUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield auth_model_1.User.findByIdAndUpdate(id, { $pull: { report: reportUrl } }, // Removes the matching report URL from the array
        { new: true, runValidators: true });
        return updatedUser;
    }
    catch (error) {
        throw new Error(`Failed to delete report: ${error.message}`);
    }
});
exports.deleteReport = deleteReport;
