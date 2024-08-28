import express from 'express'
import { GetUser } from '../Controllers/User/GettingUserDetails.js'
import { SearchUser } from '../Controllers/User/SearchUser.js'
const UserRouter = express.Router()
UserRouter.get('/GetUser', GetUser)
/**sending userID as a query */
UserRouter.get('/SearchUser', SearchUser)
/**sending name as a query */
export default UserRouter
