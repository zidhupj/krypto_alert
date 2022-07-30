import express from 'express'
const router = express.Router()

import { Prisma, PrismaClient } from '@prisma/client'
import { hashPassword } from '../utils/hash'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import { jwtMiddleware } from '../middleware/jwt'
import { cacheAllAlerts, deleteAlerts, getAllAlerts } from '../cache/allAlert'
const prisma = new PrismaClient()

// Use jwt auth middleware
router.use(jwtMiddleware)

// Api endpoint to create an alert
router.post('/create', async (req, res) => {
    const email: string = req.body.userCred.email
    let symbol: string;
    let price: number;
    try {
        symbol = req.body.symbol;
        price = req.body.price;
        // Checking if symbol and price are provided
        if (!symbol || !price) throw new Error();
    }
    catch (err) {
        console.log((err as Error).message)
        return res.status(400).send((err as Error).message);
    }
    try {
        const response = await prisma.user.update({
            where: { email: email },
            data: {
                alerts: {
                    create: {
                        price: Number(price),
                        status: "created",
                        coin: {
                            connect: {
                                symbol: symbol,
                            }
                        }
                    }
                }
            }, select: {
                email: true,
                alerts: {
                    orderBy: { id: 'desc' },
                    take: 1,
                    select: { coinSymbol: true, price: true, id: true }
                }
            }
        })

        // Since the alert values are changed the cache layer should be deleted
        await deleteAlerts(email);

        res.json(response)

    } catch (err) {
        console.log((err as Error).message)
        res.status(400).send("Invalid Symbol");
    }
})

// Api endpoint to delete an alert
router.delete("/delete/:id", async (req, res) => {
    const email: string = req.body.userCred.email
    let id: number
    try {
        id = Number(req.params.id)
        // Checking if symbol and price are provided
        if (!id) throw new Error();
    }
    catch (err) {
        console.log((err as Error).message)
        return res.status(400).send((err as Error).message);
    }
    try {
        await prisma.user.update({
            where: { email: email },
            data: { alerts: { update: { where: { id: id }, data: { status: "deleted" } } } }
        })

        await deleteAlerts(email);

        res.send(`alert ${id} successfully deleted`);

    } catch (err) {
        console.log((err as Error).message)
        res.status(400).send("Invalid Id");
    }
})

// Api endpoint to fetch all alerts user have created
router.get('/all', async (req, res) => {
    try {
        const email: string = req.body.userCred.email

        const status = req.query.status

        let offset: number = Number(req.query.offset);
        let limit: number = Number(req.query.limit);
        if (!offset) offset = 0;
        if (!limit) limit = 100;

        if (limit >= 100 && offset == 0 && !status) {
            // Returning cached values if the conditions are right
            const result = await getAllAlerts(email)
            if (result) {
                return res.json(result)
            }
        }

        let response
        if (status === 'created' || status === 'deleted' || status === 'triggered') {
            response = await prisma.user.findUnique({
                where: { email: email },
                select: {
                    email: true,
                    alerts: {
                        take: limit,
                        skip: offset,
                        where: { status: status },
                        select: { coinSymbol: true, price: true, id: true }
                    }
                }
            })
        }
        else {
            response = await prisma.user.findUnique({
                where: { email: email },
                select: {
                    email: true,
                    alerts: {
                        take: limit,
                        skip: offset,
                        select: { coinSymbol: true, price: true, id: true }
                    }
                }
            })
            if (limit >= 100 && offset == 0 && response?.email && response?.alerts) {
                // Adding a chaching layer
                await cacheAllAlerts(response.email, response.alerts)
            }
        }

        res.json(response)
    } catch (err) {
        console.log((err as Error).message)
        res.status(400).send("Invalid Id");
    }
})

export default router