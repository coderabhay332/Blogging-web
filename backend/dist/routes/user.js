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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const medium_common_1 = require("@100xdevs/medium-common");
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.userRouter = express_1.default.Router(); // Use Router() instead of express()
const prisma = new client_1.PrismaClient();
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    // Validate input using Zod
    const validationResult = medium_common_1.signupInput.safeParse(body);
    if (!validationResult.success) {
        return res.status(400).json({
            message: "Inputs not correct",
            errors: validationResult.error.issues
        });
    }
    try {
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(body.password, 10);
        // Create a new user in the database
        const user = yield prisma.user.create({
            data: {
                username: body.username,
                password: hashedPassword,
                name: body.name
            }
        });
        // Create a JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || "", { expiresIn: '1h' });
        return res.status(201).json({
            message: "User successfully created",
            token
        });
    }
    catch (error) { // Explicitly type as 'unknown'
        const errorMessage = error.message || "Failed to create user"; // Safely extract error message
        console.error("Error creating user:", error); // Log the error for debugging
        return res.status(500).json({
            message: errorMessage
        });
    }
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    // Validate input using Zod
    const validationResult = medium_common_1.signinInput.safeParse(body);
    if (!validationResult.success) {
        return res.status(400).json({
            message: "Inputs not correct",
            errors: validationResult.error.issues
        });
    }
    try {
        // Find the user by username
        const user = yield prisma.user.findUnique({
            where: { username: body.username }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check password validity
        const isPasswordValid = yield bcrypt_1.default.compare(body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        // Create a JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || "", { expiresIn: '1h' });
        return res.json({ token });
    }
    catch (error) { // Explicitly type as 'unknown'
        const errorMessage = error.message || "Failed to sign in"; // Safely extract error message
        console.error("Error signing in:", error); // Log the error for debugging
        return res.status(500).json({
            message: errorMessage
        });
    }
}));
