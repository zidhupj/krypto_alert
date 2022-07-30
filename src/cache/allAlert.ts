import { createClient } from 'redis';
const client = createClient();
client.connect()

export const cacheAllAlerts = async (email: string, alerts: any) => {

    await client.set('email', JSON.stringify(alerts));
}

export const getAllAlerts = async (email: string) => {
    try {
        return await client.get(email);
    } catch (err) {
        return false;
    }
}

export const deleteAlerts = async (email: string) => {
    try {
        await client.del('email')
    } catch (error) {

    }
}