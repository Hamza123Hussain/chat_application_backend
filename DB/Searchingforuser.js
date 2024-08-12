import express from 'express'
import { db } from '../FirebaseConfig.js'
import { collection, query, where, getDocs } from 'firebase/firestore'

const SearchRouter = express.Router()

SearchRouter.post('/', async (req, res) => {
  const { name } = req.body

  try {
    // Create a query against the collection
    const usersCollection = collection(db, 'Users')
    const q = query(usersCollection, where('Name', '==', name))

    // Execute the query
    const userQuerySnapshot = await getDocs(q)

    if (!userQuerySnapshot.empty) {
      // Collect all matching documents in an array
      const usersArray = []
      userQuerySnapshot.forEach((doc) => {
        usersArray.push(doc.data())
      })

      // Return the array of users
      res.status(200).json(usersArray)
    } else {
      res.status(400).json({ Message: `No user found with the name: ${name}` })
    }
  } catch (error) {
    console.error('Error searching user:', error)
    res.status(500).json({ Message: `Server error: ${error.message}` })
  }
})

export default SearchRouter
