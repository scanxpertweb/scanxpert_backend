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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController = __importStar(require("./auth.controllers"));
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.post('/verify-token', (req, res) => {
    AuthController.verifyIdToken(req, res);
});
router.post('/register', multer_1.reportUpload.array('report', 5), (req, res) => {
    AuthController.registerUser(req, res);
});
router.post('/check-user', (req, res) => {
    AuthController.checkUserExists(req, res);
});
router.get('/list', (req, res) => {
    AuthController.findAllUsers(req, res);
});
router.get('/user/:id', (req, res) => {
    AuthController.findUserById(req, res);
});
router.patch("/user/:id", (req, res) => {
    AuthController.updateUserById(req, res);
});
router.post('/report/:id', multer_1.reportUpload.array('report', 5), (req, res) => {
    AuthController.uploadReportFile(req, res);
});
router.post('/delete/:id', (req, res) => {
    AuthController.deleteReport(req, res);
});
router.delete('/user/:id', (req, res) => {
    AuthController.deleteUserById(req, res);
});
exports.default = router;
