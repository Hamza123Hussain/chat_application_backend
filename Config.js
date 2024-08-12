import 'dotenv/config'
const Port = process.env.Port
const Api = process.env.apiKey
const authDomain = process.env.authDomain
const projectId = process.env.projectId
const appIdmessaging = process.env.appId
const SenderId = process.env.SenderId
const storageBucket = process.env.storageBucket
export {
  Port,
  Api,
  authDomain,
  projectId,
  appIdmessaging,
  SenderId,
  storageBucket,
}
