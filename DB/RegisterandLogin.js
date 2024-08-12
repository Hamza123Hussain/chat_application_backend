import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db, storage } from '../FirebaseConfig.js'
import express from 'express'
import multer from 'multer'

const Router = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

Router.post('/Register', upload.single('File'), async (req, res) => {
  const { email, password, Name } = req.body

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    if (userCredential) {
      let fileURL = ''

      // Upload the file to Firebase Storage
      if (req.file) {
        const fileRef = ref(
          storage,
          `users/${userCredential.user.uid}/${req.file.originalname}`
        )
        await uploadBytes(fileRef, req.file.buffer)
        fileURL = await getDownloadURL(fileRef)
      }

      // Save the user data to Firestore
      await setDoc(doc(db, 'Users', userCredential.user.uid), {
        Name,
        Email: email,
        id: userCredential.user.uid,
        Blocked: [],
        FileURL: fileURL,
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

// Route for user login
Router.post('/Login', async (req, res) => {
  const { inputVal } = req.body
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      inputVal.email,
      inputVal.password
    )

    if (userCredential) {
      // Return the user ID upon successful login
      res.status(200).json(userCredential.user.uid)
    }
  } catch (error) {
    console.error('Error during Login:', error)
    res.status(500).send('Error during Login')
  }
})

Router.post('/SignOut', async (req, res) => {
  try {
    await signOut(auth) // Sign out the user

    // Send a success response
    res.status(200).json({ message: 'Sign-out successful' })
  } catch (error) {
    console.error('Error during signout:', error)
    res.status(500).send('Error during signout')
  }
})

export default Router
