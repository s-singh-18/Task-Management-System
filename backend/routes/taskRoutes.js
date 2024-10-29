const express = require('express');
const { createTask, updateTask, deleteTask, getTasks, updateTaskOrder } = require('../controllers/taskController');

const router = express.Router();

router.post('/create', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/', getTasks);
router.patch('/order', updateTaskOrder); // Ensure this is defined in the controller

module.exports = router;