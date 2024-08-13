import { WebSocketServer } from 'ws' // Importing WebSocketServer from the 'ws' package
import { db } from '../FirebaseConfig.js' // Importing Firestore database configuration
import { doc, updateDoc, arrayUnion } from 'firebase/firestore' // Import necessary Firestore functions

// Function to start the WebSocket server
export const startWebSocketMessagesServer = (server) => {
  // Create a new WebSocket server attached to an existing HTTP server
  const wss = new WebSocketServer({ server })

  // Event listener for a new client connection
  wss.on('connection', (ws) => {
    console.log('Client connected')

    // Event listener for receiving a message from the client
    ws.on('message', async (message) => {
      try {
        // Parse the received message, expecting a JSON string with chatID, text, and senderId
        const { chatID, text, senderId } = JSON.parse(message)
        console.log(`Received message from ${senderId} for chat ID: ${chatID}`)

        // Reference to the specific document in the 'Chats' collection for this chatID
        const chatDocRef = doc(db, 'userchats', chatID)

        // Update the document by pushing the new message to the messages array
        await updateDoc(chatDocRef, {
          messages: arrayUnion({
            senderId,
            text,
            timestamp: new Date(), // Example field; adjust as needed
          }),
        })

        // Broadcast the new message to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ chatID, senderId, text }))
          }
        })

        // Send an acknowledgment back to the client
        ws.send(
          JSON.stringify({
            success: true,
            message: 'Message received and broadcasted',
          })
        )
      } catch (error) {
        console.error('Error handling message:', error)
        ws.send(
          JSON.stringify({
            success: false,
            message: 'Error processing message',
            error: error.message,
          })
        )
      }
    })

    // Event listener for when the client disconnects
    ws.on('close', () => {
      console.log('Client disconnected')
    })

    // Event listener for WebSocket errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  })

  console.log('WebSocket message server is running.')
}
