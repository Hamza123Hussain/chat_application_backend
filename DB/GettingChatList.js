import { WebSocketServer } from 'ws' // Correct import for ES Modules
import { db } from '../FirebaseConfig.js'

export const startWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws) => {
    console.log('Client connected')

    ws.on('message', (message) => {
      const { userId } = JSON.parse(message)
      console.log(`Listening to chats for user ID: ${userId}`)

      const userChatsDocRef = db.collection('userchats').doc(userId)

      const unsubscribe = userChatsDocRef.onSnapshot(
        async (docSnapshot) => {
          if (docSnapshot.exists) {
            const chatItems = docSnapshot.data().chats || []

            const chatData = await Promise.all(
              chatItems.map(async (item) => {
                try {
                  const userDocRef = db.collection('users').doc(item.receiverId)
                  const userDocSnap = await userDocRef.get()

                  if (userDocSnap.exists) {
                    const user = userDocSnap.data()
                    return { ...item, user }
                  } else {
                    console.error(`User with ID ${item.receiverId} not found.`)
                    return { ...item, user: null }
                  }
                } catch (error) {
                  console.error('Error fetching user data:', error)
                  return { ...item, user: null }
                }
              })
            )

            ws.send(JSON.stringify({ chatData }))
          } else {
            console.log(`No chat document found for user ID: ${userId}`)
            ws.send(
              JSON.stringify({
                message: 'No chat document found for this user.',
              })
            )
          }
        },
        (error) => {
          console.error('Error listening to user chats:', error)
          ws.send(
            JSON.stringify({ message: 'Error listening to user chats.', error })
          )
        }
      )

      ws.on('close', () => {
        console.log('Client disconnected, cleaning up listener')
        unsubscribe()
      })
    })
  })

  console.log('WebSocket server is running.')
}
