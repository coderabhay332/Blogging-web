import { createBlogInput, updateBlogInput } from "@100xdevs/medium-common";
import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
export const blogRouter = express();
const prisma = new PrismaClient();


blogRouter.use("/*", async (req, res, next) => {
    const headtoken = req.header('Authorization');
    console.log(headtoken)
    if (!headtoken || !headtoken.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Authorization token not found or invalid" });
    }
    
    const token = headtoken.split(' ')[1]; // Extract the token

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "");

        // Check if payload is of type JwtPayload
        if (typeof payload === 'object' && (payload as JwtPayload).id) {
            // Now TypeScript knows that `payload` is a JwtPayload with an `id`
            res.locals.id = (payload as JwtPayload).id; // Set the user ID
            next();
        } else {
            return res.status(403).json({ error: "Unauthorized: invalid token payload" });
        }
    } catch (error) {
        // Handle the `unknown` type of error by narrowing down the type using type assertion
        const errMsg = (error instanceof Error) ? error.message : "An unknown error occurred during JWT verification";
        console.error("JWT Verification Error:", errMsg);
        return res.status(401).json({ error: "Unauthorized", details: errMsg });
    }
});



function isJwtPayload(payload: unknown): payload is JwtPayload {
    // Check if the payload is an object and has an id property
    return (
        typeof payload === 'object' &&
        payload !== null &&
        'id' in payload
    );
}

blogRouter.post("/", async (req, res) => {
    const body = req.body;
    const Uid = res.locals.id;

    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        return res.status(411).json({ message: "Inputs not correct" });
    }
    
    try {
        const post = await prisma.blog.create({
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
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).send({ error: "An error occurred while creating the post" });
    }
});

// Blog post update route
blogRouter.put("/", async (req, res) => {
    const body = req.body;
    const userId = res.locals.id;

    console.log(`Updating post with ID: ${body.id}`);
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        return res.status(411).json({ message: "Inputs not correct" });
    }

    try {
        // Check if the post exists and belongs to the current user
        const updatedPost = await prisma.blog.update({
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
    } catch (error) {
        console.error("Error updating post:", error);
        return res.status(404).send({ error: "Post not found or unauthorized" });
    }
});
blogRouter.get("/bulk", async (req, res) => {
    console.log("bulk route hit")
    try {
        const posts = await prisma.blog.findMany();
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).send({ 
            error: "An error occurred while fetching posts",
          // Log the error message for debugging
        });
    }
});

blogRouter.get("/:id", async (req, res) => {
    const postId = Number(req.params.id);
    console.log("Fetching post with ID:", postId);
    
    try {
        const post = await prisma.blog.findUnique({
            where: {
                id: postId,
            },
        });

        if (post) {
            return res.status(200).json({ post });
        } else {
            return res.status(404).send({ message: "Post not found" });
        }
    } catch (error) {
        console.error("Error fetching post:", error);
        return res.status(500).send({ error: "An error occurred while fetching the post" });
    }
});

// Bulk blog post route
