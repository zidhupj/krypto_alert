import express from 'express'
const router = express.Router()

import { Prisma, PrismaClient } from '@prisma/client'
import { hashPassword, verifyPassword } from '../utils/hash'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
const prisma = new PrismaClient()

// User creation Route
router.post('/create', async (req, res) => {
    let email: string
    let password: string
    try {
        email = req.body.email;
        password = req.body.password;
        // Checking if email and password are provided
        if (!email || !password) throw new Error();
    }
    catch (err) {
        console.log((err as Error).message)
        return res.status(400).send((err as Error).message);
    }

    try {
        // Hashing the password
        const hashedPassword = await hashPassword(password)

        // Storing user to database
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }, select: {
                email: true
            }
        })

        // Generating access token and refresh token
        const accessToken = await generateAccessToken(email)
        const refreshToken = await generateRefreshToken(email)

        // Setting jwt token and sending the user object back to the user
        res
            .cookie("accessToken", accessToken)
            // .cookie("refreshToken", refreshToken)
            .send(user)


    } catch (err) {
        console.log((err as Error).message)
        res.status(403).send((err as Error).message);
    }
})

// User login
router.post('/login', async (req, res) => {
    let email: string
    let password: string
    let hashedPassword: string
    try {
        email = req.body.email;
        password = req.body.password;
        // Checking if email and password are provided
        if (!email || !password) throw new Error();

        const response = await prisma.user.findUnique({
            where: { email: email },
            select: { password: true }
        })
        if (!response) throw new Error();

        hashedPassword = response.password
    }
    catch (err) {
        console.log((err as Error).message)
        return res.status(400).send((err as Error).message);
    }
    try {
        if (!verifyPassword(hashedPassword, password))
            res.status(400).send("Invalid password");

        // Generating access token and refresh token
        const accessToken = await generateAccessToken(email)
        const refreshToken = await generateRefreshToken(email)

        // Setting jwt token and sending the user object back to the user
        res
            .cookie("accessToken", accessToken)
            // .cookie("refreshToken", refreshToken)
            .send("you are logged in... check your cookies for the access token")

    } catch (err) {
        console.log((err as Error).message)
        res.status(403).send((err as Error).message);
    }
})

export default router