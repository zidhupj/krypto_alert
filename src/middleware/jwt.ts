import { NextFunction, Request, Response } from 'express'

import { Prisma, PrismaClient } from '@prisma/client'
import { verifyToken } from '../utils/jwt'
import console from 'console'
const prisma = new PrismaClient()

export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Getting the access token from the user
    const accessToken: string = req.cookies.accessToken
    if (!accessToken) {
        res.status(400).send("Invalid credentials")
        next()
    }

    // Getting the user credentials from access token
    const userCred: { email: string } = await verifyToken(accessToken)
    if (!userCred) {
        res.status(400).send("Invalid credentials")
        next()
    }

    console.log(userCred)
    req.body['userCred'] = userCred
    next()
}