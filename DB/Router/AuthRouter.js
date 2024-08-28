import multer from 'multer'
import express from 'express'
import { Register } from '../Controllers/Auth/Register.js'
import { Login } from '../Controllers/Auth/Login.js'
import { Signout } from '../Controllers/Auth/Signout.js'
const upload = multer({ storage: multer.memoryStorage() })
const AuthRouter = express.Router()
AuthRouter.post('/Register', upload.single('File'), Register)
AuthRouter.post('/Login', Login)
AuthRouter.get('/SignOut', Signout)
export default AuthRouter
