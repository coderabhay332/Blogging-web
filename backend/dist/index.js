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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = __importDefault(require("zod"));
dotenv_1.default.config();
const passSchema = zod_1.default.string().min(8).max(20);
const emailSchema = zod_1.default.string().email({
    message: "invalid email address"
});
const app = (0, express_1.default)();
const PORT = 3000;
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
// Middleware to check JWT token
app.use("/api/v1/blog/*", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const headtoken = yield req.header('Authorization');
    console.log(headtoken);
    if (!headtoken) {
        return res.status(401).json({ error: "headtoken not found" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(headtoken, process.env.JWT_SECRET || "");
        console.log(payload);
        if (!payload) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        else {
            // Set the decoded payload in the request object
            res.locals.id = payload.id;
            next(); // Call next to pass control to the next middleware
        }
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({ error: "Unauthorized" });
    }
}));
app.get("/", (req, res) => {
    res.send({
        msg: "hii from dashbord"
    });
});
// User signup route
app.post("/api/v1/user/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = yield prisma.user.create({
            data: {
                email: emailSchema.parse(body.email),
                password: passSchema.parse(body.password)
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || "");
        return res.status(201).json({
            message: "User successfully created",
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to create user",
            error: error
        });
    }
}));
// User signin route
app.post("/api/v1/user/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: emailSchema.parse(body.email)
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || "");
        return res.json({
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to sign in",
            error: error
        });
    }
}));
app.post("/api/v1/blog/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const Uid = res.locals.id;
    try {
        const post = yield prisma.post.create({
            data: {
                authorId: Uid,
                title: body.title,
                content: body.content
            }
        });
        if (post) {
            return res.json({
                message: "post created",
                id: post.id
            });
        }
    }
    catch (error) {
        return res.send(error);
    }
}));
// Blog post update route
app.put("/api/v1/blog/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const userId = res.locals.id;
    console.log(`body id is ${req.body.id}`);
    // Check if the post exists and belongs to the current user
    prisma.post.update({
        where: {
            id: userId,
            authorId: userId
        },
        data: {
            title: body.title,
            content: body.content
        }
    });
    return res.send("..");
}));
app.get("/api/v1/blog/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    console.log(userId);
    try {
        const post = yield prisma.post.findFirst({
            where: {
                authorId: userId, // Ensure this field exists in your schema
            },
        });
        if (post) {
            // Add specific blog post logic here
            res.send({ userId, post });
        }
        else {
            res.status(404).send({ message: "Post not found" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while fetching the post" });
    }
}));
// Bulk blog post route
app.get("/api/v1/blog/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield prisma.post.findMany({});
    return res.json(post);
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
