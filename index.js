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

// CORS configuration
const corsOptions = {
  origin: '*', // Adjust according to your deployment needs
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}

app.use(cors(corsOptions))
app.use(express.json())

// Create HTTP server
const server = http.createServer(app)

// Initialize Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // Adjust according to your deployment needs
    methods: ['GET', 'POST'],
  },
})

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected')

  // Handle UserList event
  socket.on('UserList', async (userId) => {
    console.log(`Received UserList with userId: ${userId}`)
    try {
      const chatData = await GetUserList(userId)
      socket.emit('UserListReceived', chatData)
    } catch (error) {
      console.error('Error fetching user list:', error)
      socket.emit('error', 'Error fetching user list')
    }
  })

  // Handle Chat event
  socket.on('Chat', async (chatID) => {
    console.log(`Received Chat with ChatID: ${chatID}`)
    try {
      const chatData = await GetChat(chatID)
      io.emit('ChatData', chatData)
    } catch (error) {
      console.error('Error fetching chat data:', error)
      socket.emit('error', 'Error fetching chat data')
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })

  // Error handling for connection
  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error)
  })
})

// Set up routes
app.use('/api/Auth', AuthRouter)
app.use('/api/User', UserRouter)
app.use('/api/Chats', ChatRouter)

// Start the server
server.listen(Port1, () => {
  console.log(`App and WebSocket server running on http://localhost:${Port1}`)
})
