import { Router } from 'express';
import { getStructures, getStructuresById } from '../controllers/structures.controller'

const router = Router();

router.get('/api/Structures', getStructures)
router.get('/api/Structures/:id', getStructuresById)

export default router;