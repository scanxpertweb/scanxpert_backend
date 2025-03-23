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
exports.updateRole = exports.findRole = exports.createRole = void 0;
const role_1 = require("../collections/role");
const createRole = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield role_1.Role.create({ name });
});
exports.createRole = createRole;
const findRole = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield role_1.Role.find();
});
exports.findRole = findRole;
const updateRole = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield role_1.Role.findByIdAndUpdate(id, { name }, { new: true });
});
exports.updateRole = updateRole;
