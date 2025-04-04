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
dotenv_1.default.config(); // Load .env variables
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://scanxperts.vercel.app", "https://www.scanxperts.in"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
}));
(0, database_1.default)(); // ⬅️ Connect to MongoDB
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/role', role_routes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
