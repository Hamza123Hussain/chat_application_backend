import express from 'express'
import cors from 'cors'
import { Port } from './Config.js'
import Router from './DB/RegisterandLogin.js'
import UserRouter from './DB/GettingUserData.js'
import http from 'http'
import { startWebSocketServer } from './DB/GettingChatList.js'
const App = express()
// Apply CORS middleware with default options (allow all origins)
App.use(cors())
App.use(express.json())

App.use('/api/User', Router)
App.use('/api/GetUser', UserRouter)

const server = http.createServer(App)

// Start the WebSocket server
startWebSocketServer(server)

// Your other Express routes and middleware...

// Start the HTTP server on port 5000
server.listen(Port, () => {
  console.log('HTTP server running on http://localhost:5000')
})
