import express from 'express'
import { GetUser } from '../Controllers/User/GettingUserDetails.js'
import { SearchUser } from '../Controllers/User/SearchUser.js'
import { CreateMssage } from '../Controllers/User/SendingMessage.js'

const UserRouter = express.Router()
UserRouter.get('/GetUser', GetUser)
/**sending userID as a query */
UserRouter.get('/SearchUser', SearchUser)
/**sending name as a query */
UserRouter.post('/NewMessage', CreateMssage)
export default UserRouter
