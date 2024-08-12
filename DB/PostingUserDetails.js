import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db, storage } from '../FirebaseConfig.js'
app.post('/register', async (req, res) => {
  const { email, password, name, file } = req.body

  try {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    if (userCredential) {
      let fileURL = ''

      // Upload the file to Firebase Storage
      if (file) {
        const fileRef = ref(
          storage,
          `users/${userCredential.user.uid}/${file.name}`
        )
        await uploadBytes(fileRef, file)
        fileURL = await getDownloadURL(fileRef)
      }

      // Save the user data to Firestore
      await setDoc(doc(db, 'Users', userCredential.user.uid), {
        Name: name,
        Email: email,
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
