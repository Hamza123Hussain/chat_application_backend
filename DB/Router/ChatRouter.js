import express from 'express'
import { CreateChat } from '../Controllers/Chat/CreateChat.js'
import { GetUserList } from '../Controllers/Chat/GettingChatList.js'
import { GetChatOnce } from '../Controllers/Chat/GetChatOnce.js'
const ChatRouter = express.Router()
ChatRouter.get('/GetChatOnce', GetChatOnce)
/**sending ChatID as a query */
ChatRouter.post('/CreateChat', CreateChat)
ChatRouter.get('/GetChatList', GetUserList)
export default ChatRouter
