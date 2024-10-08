import { signupInput, signinInput } from "@100xdevs/medium-common";
import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const userRouter = express.Router(); // Use Router() instead of express()
const prisma = new PrismaClient();

userRouter.post("/signup", async (req, res) => {
    const body = req.body;

    // Validate input using Zod
    const validationResult = signupInput.safeParse(body);
    if (!validationResult.success) {
        return res.status(400).json({
            message: "Inputs not correct",
            errors: validationResult.error.issues
        });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Create a new user in the database
        const user = await prisma.user.create({
            data: {
                username: body.username,
                password: hashedPassword,
                name: body.name
            }
        });

        // Create a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", { expiresIn: '1h' });

        return res.status(201).json({
            message: "User successfully created",
            token
        });
    } catch (error: unknown) { // Explicitly type as 'unknown'
        const errorMessage = (error as { message?: string }).message || "Failed to create user"; // Safely extract error message
        console.error("Error creating user:", error); // Log the error for debugging
        return res.status(500).json({
            message: errorMessage
        });
    }
});

userRouter.post("/signin", async (req, res) => {
    const body = req.body;

    // Validate input using Zod
    const validationResult = signinInput.safeParse(body);
    if (!validationResult.success) {
        return res.status(400).json({
            message: "Inputs not correct",
            errors: validationResult.error.issues
        });
    }

    try {
        // Find the user by username
        const user = await prisma.user.findUnique({
            where: { username: body.username }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check password validity
        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", { expiresIn: '1h' });

        return res.json({ token });
    } catch (error: unknown) { // Explicitly type as 'unknown'
        const errorMessage = (error as { message?: string }).message || "Failed to sign in"; // Safely extract error message
        console.error("Error signing in:", error); // Log the error for debugging
        return res.status(500).json({
            message: errorMessage
        });
    }
});
