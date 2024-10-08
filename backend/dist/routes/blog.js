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
exports.blogRouter = void 0;
const medium_common_1 = require("@100xdevs/medium-common");
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.blogRouter = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
exports.blogRouter.use("/*", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const headtoken = req.header('Authorization');
    console.log(headtoken);
    if (!headtoken || !headtoken.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Authorization token not found or invalid" });
    }
    const token = headtoken.split(' ')[1]; // Extract the token
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        // Check if payload is of type JwtPayload
        if (typeof payload === 'object' && payload.id) {
            // Now TypeScript knows that `payload` is a JwtPayload with an `id`
            res.locals.id = payload.id; // Set the user ID
            next();
        }
        else {
            return res.status(403).json({ error: "Unauthorized: invalid token payload" });
        }
    }
    catch (error) {
        // Handle the `unknown` type of error by narrowing down the type using type assertion
        const errMsg = (error instanceof Error) ? error.message : "An unknown error occurred during JWT verification";
        console.error("JWT Verification Error:", errMsg);
        return res.status(401).json({ error: "Unauthorized", details: errMsg });
    }
}));
function isJwtPayload(payload) {
    // Check if the payload is an object and has an id property
    return (typeof payload === 'object' &&
        payload !== null &&
        'id' in payload);
}
exports.blogRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const Uid = res.locals.id;
    const { success } = medium_common_1.createBlogInput.safeParse(body);
    if (!success) {
        return res.status(411).json({ message: "Inputs not correct" });
    }
    try {
        const post = yield prisma.blog.create({
            data: {
                authorId: Uid,
                title: body.title,
                content: body.content
            }
        });
        return res.status(201).json({
            message: "Post created",
            id: post.id
        });
    }
    catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).send({ error: "An error occurred while creating the post" });
    }
}));
// Blog post update route
exports.blogRouter.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const userId = res.locals.id;
    console.log(`Updating post with ID: ${body.id}`);
    const { success } = medium_common_1.updateBlogInput.safeParse(body);
    if (!success) {
        return res.status(411).json({ message: "Inputs not correct" });
    }
    try {
        // Check if the post exists and belongs to the current user
        const updatedPost = yield prisma.blog.update({
            where: {
                id: body.id,
                authorId: userId
            },
            data: {
                title: body.title,
                content: body.content
            }
        });
        return res.status(200).send({ message: "Post updated", post: updatedPost });
    }
    catch (error) {
        console.error("Error updating post:", error);
        return res.status(404).send({ error: "Post not found or unauthorized" });
    }
}));
exports.blogRouter.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bulk route hit");
    try {
        const posts = yield prisma.blog.findMany();
        return res.status(200).json(posts);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).send({
            error: "An error occurred while fetching posts",
            // Log the error message for debugging
        });
    }
}));
exports.blogRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.id);
    console.log("Fetching post with ID:", postId);
    try {
        const post = yield prisma.blog.findUnique({
            where: {
                id: postId,
            },
        });
        if (post) {
            return res.status(200).json({ post });
        }
        else {
            return res.status(404).send({ message: "Post not found" });
        }
    }
    catch (error) {
        console.error("Error fetching post:", error);
        return res.status(500).send({ error: "An error occurred while fetching the post" });
    }
}));
// Bulk blog post route
