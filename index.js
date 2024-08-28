import express from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { Port1 } from './Config.js'
import AuthRouter from './DB/Router/AuthRouter.js'
import UserRouter from './DB/Router/UserRouter.js'
import ChatRouter from './DB/Router/ChatRouter.js'
import { CreateMssage } from './DB/Controllers/User/CreatingandGettingMessages.js'

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

app.use(express.json())
app.use('/api/Auth', AuthRouter)
app.use('/api/User', UserRouter)
app.use('/api/Chats', ChatRouter)

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(Port1, () => {
  console.log(`App and WebSocket server running on http://localhost:${Port1}`)
})

// Integrate the message creation handler with Socket.IO
app.post('/api/User/NewMessage', async (req, res) => {
  await CreateMssage(req, res, io)
})
app.get('/api/Chats/GetChatList', (req, res) => GetChats(req, res, io))
