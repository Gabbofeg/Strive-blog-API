const express = require('express')
const mongoose  = require('mongoose')
const cors = require('cors')
const path = require('path')
const {
    badRequestHandler,
    genericErrorHandler,
    notfoundHandler,
    unauthorizedHandler,
  } = require("./middleware/errorHandlers")
const PORT = 4040



require('dotenv').config()

const server = express()

server.use('/uploads', express.static(path.join(__dirname, './uploads')))

const authorsRoute = require('./routes/authors')
const blogRoute = require('./routes/blog')

server.use(express.json())
server.use(cors())


server.use( '/authors', authorsRoute )
server.use( '/blogPosts', blogRoute )

server.use(notfoundHandler)
server.use(unauthorizedHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Db connection error'))
db.once('open', () => {
    console.log('Db connected successfully')
})

server.listen(PORT, () => console.log(`Server up and running on port ${PORT}`))