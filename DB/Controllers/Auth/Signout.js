import { signOut } from 'firebase/auth'
import { auth } from '../../../FirebaseConfig.js'

export const Signout = async (req, res) => {
  try {
    await signOut(auth)
    res.status(200).json({ message: 'Sign-out successful' })
  } catch (error) {
    console.error('Error during signout:', error)
    res.status(500).send('Error during signout')
  }
}
