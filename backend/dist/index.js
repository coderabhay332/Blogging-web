"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./routes/user"); // Import user router
const blog_1 = require("./routes/blog"); // Import blog router
const cors = require('cors');
const app = (0, express_1.default)();
// Use CORS middleware for all routes
app.use(cors());
app.use(express_1.default.json());
// Use routers for specific paths
app.use("/api/v1/user", user_1.userRouter);
app.use("/api/v1/blog", blog_1.blogRouter);
app.listen(3000);
exports.default = app;
