import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import axios from "axios"

import { createClient } from 'redis';
const publisher = createClient();


export const fetchPriceOnInterval = async () => {
    await publisher.connect()
    console.log("Redis connection established")

    await publisher.publish('id', "7");

    setInterval(async () => {
        const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=100&page=1&sparkline=false")

        await data.forEach(async (item: { symbol: string, current_price: number }) => {
            const response = await prisma.coin.findUnique({
                where: { symbol: item.symbol },
                select: {
                    symbol: true,
                    alerts: {
                        where: { status: 'created' },
                        select: { id: true, price: true, userEmail: true }
                    }
                }
            })
            response?.alerts.forEach(async (alert) => {
                if (alert.price <= item.current_price) {
                    let response = await prisma.alert.update({
                        where: { id: alert.id },
                        data: { status: "triggered" },
                        select: { id: true, price: true, userEmail: true, coinSymbol: true }
                    })
                    const result = { ...response, currentPrice: item.current_price }

                    // Publish the alert message to redis message broker
                    publisher.publish('alert', JSON.stringify(result));

                }
            })
        })
    }, 10000)
}