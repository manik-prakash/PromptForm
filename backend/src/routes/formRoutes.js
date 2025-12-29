import { Router } from 'express';
import { generateSchema, createForm, listForms, getForm, getPublicForm, deleteForm } from '../controllers/formController.js';
import { submitForm, getSubmissions, exportSubmissions } from '../controllers/submissionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { paginationSchema } from '../utils/types.js';

const router = Router();

// Public routes (no auth)
router.get('/:id/public', getPublicForm);
router.post('/:id/submit', submitForm);

// Protected routes (require auth)
router.post('/generate', authenticate, generateSchema);
router.post('/create', authenticate, createForm);

router.get('/allforms', authenticate, listForms);

router.get('/:id', authenticate, getForm);

router.delete('/:id', authenticate, deleteForm);

router.get('/:id/submissions', authenticate, validate(paginationSchema, 'query'), getSubmissions);

router.get('/:id/export', authenticate, exportSubmissions);

export default router;
