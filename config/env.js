require('dotenv').config(); // this is important!

const env ={
    name: process.env.APP_NAME,
    privateKey: process.env.PRIVATE_KEY,
    refreshKey: process.env.REFRESH_KEY,
    forgetPasswordKey: process.env.RESET_PASSWORD_KEY,

    inProduction : process.env.NODE_ENV === 'production' ? 'production': 'development',
    sessionSecret:  process.env.SESSION_SECRET,

    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_CONNECTION,

    appPort:  process.env.APP_PORT,
    appAddress:  process.env.APP_ADDRESS,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
} 
module.exports = env