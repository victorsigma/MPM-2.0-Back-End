import { Router } from 'express';
import { addUser, getUsers, getUserById, deleteUserById, updateUserById, loginUserByEmail, loginUserByName, updateIcon } from '../controllers/users.controller';

const router = Router();

router.get('/api/Users', getUsers)

router.post('/api/Users', addUser)

router.get('/api/Users/:id', getUserById)

router.delete('/api/Users/:id', deleteUserById)

router.put('/api/Users/:id', updateUserById)

router.post('/api/Users/login-mail', loginUserByEmail)

router.post('/api/Users/login-user', loginUserByName)

router.put('/api/Users/Icon/:user', updateIcon)


export default router;