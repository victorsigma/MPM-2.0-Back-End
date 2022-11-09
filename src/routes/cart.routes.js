import { Router } from 'express';
import { addCart, getCartTotalByUser, getCartByUser, getCartLenghtByUser, deleteCartById, updateCartById } from '../controllers/cart.controller'


const router = Router();

//router.get('/api/Cart', getCart)

router.post('/api/Cart', addCart)

router.get('/api/Cart/:user', getCartByUser)

router.get('/api/Cart/Total/:user', getCartTotalByUser)

router.get('/api/Cart/Lenght/:user', getCartLenghtByUser)

router.delete('/api/Cart/:id', deleteCartById)

router.put('/api/Cart/:id', updateCartById)

export default router;