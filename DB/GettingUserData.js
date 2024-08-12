import express from 'express'
import { db } from '../FirebaseConfig.js'
import { doc, getDoc } from 'firebase/firestore'

const UserRouter = express.Router()

UserRouter.get('/', async (req, res) => {
  const userId = req.query.userId // Use query parameters
  try {
    if (!userId) {
      return res.status(400).send('User ID is required')
    }

    // Reference to the user's document
    const userDocRef = doc(db, 'Users', userId)

    // Fetch the document
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      // If the document exists, return the data
      const userData = userDoc.data()
      console.log('User Data:', userData)
      res.status(200).send(userData)
    } else {
      // If the document does not exist
      console.log('No such user document!')
      res.status(404).send('No such user document!')
    }
  } catch (error) {
    console.error('Error fetching user details:', error)
    res.status(500).send('Error fetching user details')
  }
})

export default UserRouter
