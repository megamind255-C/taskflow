// routes/taskRoutes.js
// Maps HTTP verbs + paths to controller functions.
// Also attaches validation middleware to POST and PUT.

import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import {
  validateCreateTask,
  validateUpdateTask,
} from '../middleware/validateTask.js';

const router = Router();

router.get('/',      getTasks);
router.get('/:id',   getTaskById);
router.post('/',     validateCreateTask, createTask);
router.put('/:id',   validateUpdateTask, updateTask);
router.delete('/:id', deleteTask);

export default router;