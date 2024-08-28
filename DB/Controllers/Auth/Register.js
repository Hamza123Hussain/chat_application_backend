import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db, storage } from '../../../FirebaseConfig.js'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'
export const Register = async (req, res) => {
  const { email, password, Name } = req.body
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    if (userCredential) {
      // let fileURL = ''
      // if (req.file) {
      //   const fileRef = ref(
      //     storage,
      //     `users/${userCredential.user.uid}/${req.file.originalname}`
      //   )
      //   await uploadBytes(fileRef, req.file.buffer)
      //   fileURL = await getDownloadURL(fileRef)
      // }
      await setDoc(doc(db, 'Users', userCredential.user.uid), {
        Name,
        Email: email,
        id: userCredential.user.uid,
        Blocked: [],
        // FileURL: fileURL,
      })
      await setDoc(doc(db, 'Chats', userCredential.user.uid))
      res.status(200).send('User registered successfully')
    }
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).send('Error during registration')
  }
}
