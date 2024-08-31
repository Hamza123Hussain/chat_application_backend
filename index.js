import express from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import { Port1 } from './Config.js'
import AuthRouter from './DB/Router/AuthRouter.js'
import UserRouter from './DB/Router/UserRouter.js'
import ChatRouter from './DB/Router/ChatRouter.js'
import { GetUserList } from './DB/Controllers/Chat/GettingChatList.js'
import { GetChat } from './DB/Controllers/Chat/GetChat.js'
const app = express()
const corsOptions = {
  origin: true, // Allow all origins https://notes-app-node-next-9x72.vercel.app/
  optionsSuccessStatus: 200, // For legacy browser support
}

app.use(cors(corsOptions))
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
  socket.on('UserList', async (userId) => {
    console.log(`Received UserList with userId: ${userId}`)
    try {
      const chatData = await GetUserList(userId)
      socket.emit('UserListReceived', chatData)
    } catch (error) {
      console.error('Error fetching user list:', error)
    }
  })
  socket.on('Chat', async (ChatID) => {
    console.log(`Received Chat with ChatID: ${ChatID}`)
    try {
      const chatData = await GetChat(ChatID)
      io.emit('ChatData', chatData)
    } catch (error) {
      console.error('Error fetching chat data:', error)
    }
  })
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
server.listen(Port1, () => {
  console.log(`App and WebSocket server running on http://localhost:${Port1}`)
})
