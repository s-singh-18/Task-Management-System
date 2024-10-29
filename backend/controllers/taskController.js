const Task = require('../models/taskModel');

exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ title, description, createdBy: req.userId });

  try {
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};

exports.updateTask = async (req, res) => {
    const { title, description, dueDate, priority, status } = req.body;
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, dueDate, priority, status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
};

exports.updateTaskOrder = async (req, res) => {
    const { tasks } = req.body; // Expect an array of task IDs in the new order

    try {
        // Loop through each task and update its position
        await Promise.all(tasks.map((taskId, index) => {
            return Task.findByIdAndUpdate(taskId, { position: index });
        }));

        res.json({ message: 'Task order updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task order', error });
    }
};
