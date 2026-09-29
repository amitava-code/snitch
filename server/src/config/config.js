import dotenv from 'dotenv'
dotenv.config()

import dns from 'dns'
dns.setServers(['8.8.8.8', '8.8.4.4']);

const config = {
    MONGO_URI:process.env.MONGO_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
}


export default config