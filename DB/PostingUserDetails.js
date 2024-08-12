import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db, storage } from '../FirebaseConfig.js'
import express from 'express'

const Router = express.Router()

Router.post('/Register', async (req, res) => {
  const { inputVal } = req.body

  try {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      inputVal.email,
      inputVal.password
    )

    if (userCredential) {
      let fileURL = ''

      // Upload the file to Firebase Storage
      if (inputVal.File) {
        const fileRef = ref(
          storage,
          `users/${userCredential.user.uid}/${inputVal.File.name}`
        )
        await uploadBytes(fileRef, inputVal.File)
        fileURL = await getDownloadURL(fileRef)
      }

      // Save the user data to Firestore
      await setDoc(doc(db, 'Users', userCredential.user.uid), {
        Name: inputVal.Name,
        Email: inputVal.email,
        id: userCredential.user.uid,
        Blocked: [],
        FileURL: fileURL, // Store the download URL in Firestore
      })

      await setDoc(doc(db, 'Chats', userCredential.user.uid), {
        Chats: [],
      })

      res.status(200).send('User registered successfully')
    }
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).send('Error during registration')
  }
})

Router.get('/Login', async (req, res) => {
  const inputVal = req.body
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      inputVal.email,
      inputVal.password
    )
    if (userCredential) {
      res.status(200)
    }
  } catch (error) {
    console.error('Error during Login:', error)
    res.status(500).send('Error during Login')
  }
})

export default Router
