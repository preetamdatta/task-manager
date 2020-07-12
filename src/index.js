const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose')
const express = require('express')

const app = express()
const port = process.env.PORT

app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})
