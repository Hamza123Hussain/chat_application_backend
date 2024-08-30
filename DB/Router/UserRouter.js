import express from 'express'
import { GetUser } from '../Controllers/User/GettingUserDetails.js'
import { SearchUser } from '../Controllers/User/SearchUser.js'
import { CreateMssage } from '../Controllers/User/SendingMessage.js'
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() })
const UserRouter = express.Router()
UserRouter.get('/GetUser', GetUser)
/**sending userID as a query */
UserRouter.get('/SearchUser', SearchUser)
/**sending name as a query */
UserRouter.post('/NewMessage', upload.single('File'), CreateMssage)
export default UserRouter
