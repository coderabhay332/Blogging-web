import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import zod from "zod"
dotenv.config()
const passSchema = zod.string().min(8).max(20);
const emailSchema = zod.string().email({
    message: "invalid email address"
});
const app = express();
const PORT = 3000;
const prisma = new PrismaClient();

app.use(express.json());

interface UserType {
    email: string;
    password: string;
    id: string;
    userId: string

}
interface PostType{
    title: string;
    content: string;
    userId: string
}

// Middleware to check JWT token
app.use("/api/v1/blog/*", async (req, res, next) => {
    const headtoken =await req.header('Authorization');
    console.log(headtoken)
    if (!headtoken) {
        return res.status(401).json({ error: "headtoken not found" });
    }
    try {
        const payload: any = jwt.verify(headtoken,process.env.JWT_SECRET || "");
        console.log(payload)
        if (!payload) {
            return res.status(403).json({ error: "Unauthorized" });
        } else {
        // Set the decoded payload in the request object
            res.locals.id = payload.id;
            next(); // Call next to pass control to the next middleware
        }
    } catch (error) {
        console.log(error)
        return res.status(404).json({ error: "Unauthorized" });
    }
});

// User signup route
app.post("/api/v1/user/signup", async (req, res) => {
    const body: UserType = req.body;
    try {
        const user = await prisma.user.create({
            data: {
                email: emailSchema.parse(body.email),
                password: passSchema.parse(body.password)
            }
        });
        const token = jwt.sign({ id: user.id },process.env.JWT_SECRET || "");
        return res.status(201).json({
            message: "User successfully created",
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create user",
            error: error
        });
    }
});

// User signin route
app.post("/api/v1/user/signin", async (req, res) => {
    const body = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: emailSchema.parse(body.email)
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "");
        return res.json({
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to sign in",
            error: error
        });
    }
});


app.post("/api/v1/blog/", async(req, res) => {
const body = req.body;
const Uid = res.locals.id;
try {
    const post =await prisma.post.create({
        data: {
            authorId: Uid,
            title: body.title,
            content: body.content
        }
    })

    if(post){
        return res.json({
            message: "post created",
            id: post.id
            
        })
    
    }
} catch (error) {
    return res.send(error)
}
});

// Blog post update route
app.put("/api/v1/blog/", async (req, res) => {
    const body = req.body;
    const userId = res.locals.id;
    console.log(`body id is ${req.body.id}`)

        // Check if the post exists and belongs to the current user
        prisma.post.update({
            where: {
                id: "f7d934ea-2a7b-450f-8e68-71ab96b99402",
                authorId: userId
            },
            data: {
                title: body.title,
                content: body.content
            }
        });
        return res.send("..")
});

// Specific blog post route
app.post("/api/v1/blog/:id", (req, res) => {
    // Add specific blog post logic here
    res.status(200).json({ message: `Blog post with id ${req.params.id} accessed` });
});

// Bulk blog post route
app.get("/api/v1/blog/bulk", async(req, res) => {
    const post =await prisma.post.findMany({})
    return res.json( 
         post
    )
});

// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
