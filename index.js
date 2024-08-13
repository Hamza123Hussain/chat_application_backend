import express from 'express'
import cors from 'cors'
import Router from './DB/RegisterandLogin.js'
import UserRouter from './DB/GettingUserData.js'
import http from 'http'
import { startWebSocketServer } from './DB/GettingChatList.js'
import SearchRouter from './DB/Searchingforuser.js'
import ChatRouter from './DB/Creatinganewchat.js'
import { startWebSocketMessagesServer } from './DB/CreatingandGettingMessages.js'
import { Port1, Port2 } from './Config.js'

const App = express()

App.use(cors())
App.use(express.json())

App.use('/api/User', Router)
App.use('/api/GetUser', UserRouter)
App.use('/api/Search', SearchRouter)
App.use('/api/Chats', ChatRouter)

// Create an HTTP server for the Express app and the chat WebSocket server
const appServer = http.createServer(App)

// Create a separate HTTP server for the messages WebSocket server
const messagesServer = http.createServer()

// Start the WebSocket servers
startWebSocketServer(appServer) // Attach to the app server
startWebSocketMessagesServer(messagesServer) // Separate server for messages

// Start the servers
appServer.listen(Port1, () => {
  console.log(
    `App and Chat WebSocket server running on http://localhost:${Port1}`
  )
})

messagesServer.listen(Port2, () => {
  console.log(`Messages WebSocket server running on http://localhost:${Port2}`)
})
