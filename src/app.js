require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {
    NODE_ENV
} = require('./config')
const errorHandler = require('./middleware/error-handler')
const habitRouter = require('./habit/habit-router')
const categoryRouter = require('./category/category-router')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')

const app = express()

const morganOption = (NODE_ENV === 'production') ?
    'tiny' :
    'common';

app.use(morgan(morganOption, {
    skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

app.use(express.static('public'))

app.use('/api/habit', habitRouter)
app.use('/api/category', categoryRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use(errorHandler)

module.exports = app
