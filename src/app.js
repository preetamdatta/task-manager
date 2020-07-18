const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose')
const express = require('express')

const app = express()

app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

module.exports = app