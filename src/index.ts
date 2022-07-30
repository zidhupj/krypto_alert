import express from 'express'
const app = express()
import cookieParser from 'cookie-parser'

import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import userRoute from './routes/user'
import alertRoute from './routes/alert'

import { initCoinSymbols } from './utils/coin'
import { fetchPriceOnInterval } from './updates/price'
import { subScribeToMessageQueue } from './email/email'


async function main() {
    // Middlewares 
    app.use(express.json())
    app.use(cookieParser())

    // Router
    app.use('/user', userRoute)
    app.use('/alert', alertRoute)

    // Connecting to the database
    await prisma.$connect()
    await initCoinSymbols()
    // Start the server at port 3000
    app.listen(3000, () => {
        console.log("The server listening on localhost:3000")
        subScribeToMessageQueue();
        fetchPriceOnInterval();
    })
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })