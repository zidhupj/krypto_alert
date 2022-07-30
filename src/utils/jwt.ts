import * as jwt from 'jsonwebtoken'

const generateToken = async (email: string, time: string) => {
    return await new Promise<string>((resolve, reject) => {
        jwt.sign({ email: email }, process.env.TOKEN_SECRET || "abcd", { expiresIn: time }, (err, token) => {
            if (err) reject(err)
            resolve(token || "");
        })
    })
}

export const generateAccessToken = async (email: string) => generateToken(email, '7d');
export const generateRefreshToken = async (email: string) => generateToken(email, '7d');

export const verifyToken = async (token: string) => {
    try {
        return await new Promise<any>((resolve, reject) => {
            jwt.verify(token, process.env.TOKEN_SECRET || "abcd", (err, userCred) => {
                if (err) reject(err)
                resolve(userCred);
            })
        })
    } catch (err) {
        return undefined;
    }
}