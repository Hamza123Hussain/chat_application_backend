import express from 'express'
import cors from 'cors'
import { Port } from './Config.js'
import Router from './DB/RegisterandLogin.js'
import UserRouter from './DB/GettingUserData.js'
import http from 'http'
import { startWebSocketServer } from './DB/GettingChatList.js'
import SearchRouter from './DB/Searchingforuser.js'
import ChatRouter from './DB/Creatinganewchat.js'
const App = express()

App.use(cors())
App.use(express.json())

App.use('/api/User', Router)
App.use('/api/GetUser', UserRouter)
App.use('/api/Search', SearchRouter)
App.use('/api/Chats', ChatRouter)
const server = http.createServer(App)

startWebSocketServer(server)

server.listen(Port, () => {
  console.log('HTTP server running on http://localhost:5000')
})
