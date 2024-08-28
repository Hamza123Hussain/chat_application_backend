// In your main server file (e.g., index.js)
import express from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import { Port1 } from './Config.js'
import AuthRouter from './DB/Router/AuthRouter.js'
import UserRouter from './DB/Router/UserRouter.js'
import ChatRouter from './DB/Router/ChatRouter.js'
import { CreateMssage } from './DB/Controllers/User/CreatingandGettingMessages.js'
import { GetChats } from './DB/Controllers/Chat/GettingChatList.js'

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

app.use('/api/Auth', AuthRouter)
app.use('/api/User', UserRouter)
app.use('/api/Chats', ChatRouter)

io.on('connection', (socket) => {
  console.log('a user connected')
  io.on('UserAdded', async (userId) => {
    await GetChats(userId)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

// app.post('/api/User/NewMessage', async (req, res) => {
//   await CreateMssage(req, res, io)
// })

// app.get('/api/Chats/GetChatList', (req, res) => {
//   GetChats(req, res, io) // Pass io here
// })

server.listen(Port1, () => {
  console.log(`App and WebSocket server running on http://localhost:${Port1}`)
})
