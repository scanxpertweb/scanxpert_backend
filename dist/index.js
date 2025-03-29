"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./components/config/database"));
const auth_routes_1 = __importDefault(require("./components/auth/auth.routes"));
const cors_1 = __importDefault(require("cors"));
const role_routes_1 = __importDefault(require("./components/role/role.routes"));
const multer_1 = __importDefault(require("multer"));
const multer_2 = require("./components/utils/multer");
dotenv_1.default.config(); // Load .env variables
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
}));
(0, database_1.default)(); // ⬅️ Connect to MongoDB
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const upload = (0, multer_1.default)({ storage: multer_2.storage });
app.use(upload.any());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/role', role_routes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
