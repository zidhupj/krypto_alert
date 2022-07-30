import axios from 'axios';

import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const initCoinSymbols = async () => {
    const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=100&page=1&sparkline=false")

    await data.forEach((item: { symbol: string }) => {
        prisma.coin.upsert({
            create: {
                symbol: item.symbol
            },
            update: {},
            where: {
                symbol: "aaa"
            }
        })
    })
}

export { initCoinSymbols }