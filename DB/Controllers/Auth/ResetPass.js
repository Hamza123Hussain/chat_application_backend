import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../../FirebaseConfig.js'
export const ResetPass = async (req, res) => {
  try {
    const { email } = req.body
    await sendPasswordResetEmail(auth, email)
    res.status(200).json(true)
  } catch (error) {
    console.error('Error sending password reset email:', error)
    res.status(500).send('Failed to send password reset email')
  }
}
export default ResetPass
