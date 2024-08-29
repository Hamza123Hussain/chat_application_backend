import express from 'express'
import { GetChat } from '../Controllers/Chat/GetChat.js'
import { CreateChat } from '../Controllers/Chat/CreateChat.js'
import { GetUserList } from '../Controllers/Chat/GettingChatList.js'
const ChatRouter = express.Router()
ChatRouter.get('/GetChat', GetChat)
/**sending ChatID as a query */
ChatRouter.post('/CreateChat', CreateChat)
ChatRouter.get('/GetChatList', GetUserList)
export default ChatRouter
