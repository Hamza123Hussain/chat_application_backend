import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../FirebaseConfig.js'

export const Login = async (req, res) => {
  const { inputVal } = req.body
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      inputVal.email,
      inputVal.password
    )
    if (userCredential) {
      res.status(200).json(userCredential.user.uid)
    }
  } catch (error) {
    console.error('Error during Login:', error)
    res.status(500).send('Error during Login')
  }
}
