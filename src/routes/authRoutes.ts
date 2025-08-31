import express from 'express';
import { loginController, signUpController } from '../Controllers/authValidationontroller';



const router = express.Router()

router.post('/login', loginController)
router.post('/signup', signUpController)

export default router