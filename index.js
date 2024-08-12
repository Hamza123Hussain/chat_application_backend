import express from 'express'
import cors from 'cors'
import { Port } from './Config.js'

const App = express()

App.use(express.json())

App.listen(Port, () => {
  console.log(`Running On Port ${Port}`)
})
