import express from 'express'
import cors from 'cors'
import { Port } from './Config.js'
import Router from './DB/RegisterandLogin.js'
import UserRouter from './DB/GettingUserData.js'

const App = express()
// Apply CORS middleware with default options (allow all origins)
App.use(cors())
App.use(express.json())

App.use('/api/User', Router)
App.use('/api/GetUser', UserRouter)

App.listen(Port, () => {
  console.log(`Running On Port ${Port}`)
})
