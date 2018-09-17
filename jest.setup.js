if (process.env.NODE_ENV === 'testing') require('dotenv').config({ path: process.cwd() + '/.env.test' })

jest.setTimeout(25000)
