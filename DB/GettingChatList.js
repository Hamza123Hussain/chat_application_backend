// WebSocketServer.js
import { WebSocketServer } from 'ws' // Importing WebSocketServer from the 'ws' package
import { db } from '../FirebaseConfig.js' // Importing Firestore database configuration
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore' // Import necessary Firestore functions

// Function to start the WebSocket server
export const startWebSocketServer = (server) => {
  // Create a new WebSocket server attached to an existing HTTP server
  const wss = new WebSocketServer({ server })

  // Event listener for a new client connection
  wss.on('connection', (ws) => {
    console.log('Client connected')

    // Event listener for receiving a message from the client
    ws.on('message', (message) => {
      // Parse the received message, expecting a JSON string with a userId
      const { userId } = JSON.parse(message)
      console.log(`Listening to chats for user ID: ${userId}`)

      // Reference to the specific document in the 'Chats' collection for this user
      const userChatsDocRef = doc(collection(db, 'Chats'), userId)

      // Set up a listener for real-time updates to the user's chat document
      const unsubscribe = onSnapshot(
        userChatsDocRef,
        async (docSnapshot) => {
          // Check if the document exists
          if (docSnapshot.exists()) {
            // Retrieve the chat items from the document, or use an empty array if none exist
            const chatItems = docSnapshot.data().Chats || []

            // Process each chat item to fetch additional user data
            const chatData = await Promise.all(
              chatItems.map(async (item) => {
                try {
                  // Reference to the receiver's user document
                  const userDocRef = doc(
                    collection(db, 'Users'),
                    item.receiverId
                  )
                  // Fetch the user document snapshot
                  const userDocSnap = await getDoc(userDocRef)

                  // If the user document exists, attach the user data to the chat item
                  if (userDocSnap.exists()) {
                    const user = userDocSnap.data()
                    return { ...item, user }
                  } else {
                    // If the user document doesn't exist, log an error and return the item with user set to null
                    console.error(`User with ID ${item.receiverId} not found.`)
                    return { ...item, user: null }
                  }
                } catch (error) {
                  // Handle any errors during the user data fetch process
                  console.error('Error fetching user data:', error)
                  return { ...item, user: null }
                }
              })
            )

            // Send the processed chat data back to the client
            ws.send(JSON.stringify({ chatData }))
          } else {
            // If the chat document doesn't exist, log a message and inform the client
            console.log(`No chat document found for user ID: ${userId}`)
            ws.send(
              JSON.stringify({
                message: 'No chat document found for this user.',
              })
            )
          }
        },
        (error) => {
          // Handle any errors that occur while listening to the chat document
          console.error('Error listening to user chats:', error)
          ws.send(
            JSON.stringify({ message: 'Error listening to user chats.', error })
          )
        }
      )

      // Event listener for when the client disconnects
      ws.on('close', () => {
        console.log('Client disconnected, cleaning up listener')
        // Stop listening to Firestore updates when the client disconnects
        unsubscribe()
      })
    })
  })

  console.log('WebSocket server is running.')
}
