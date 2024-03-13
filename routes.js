const express = require('express');
const router = express.Router();

let tasks = [];
let users = [
    {email:"anum@gmail.com", password:"12345"},
    {email:"aiyza@gmail.com", password:"aoiyzaa"},
    {email:"hani@gmail.com", password:"haaa"}
]

//authentication 
const authenticateUser = (req, res, next) => {
    const { email, password } = req.headers;
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
};

router.post('/signup', (req, res) => {
    const { email, password } = req.body;
   
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
    } else {
        
        users.push({ email, password });
        res.status(201).json({ message: 'User created !' });
    }
})

//route to create task
router.post('/create_tasks', authenticateUser, (req, res) => {
    const { title, description, due_Date, category, priority } = req.body;
    const newTask = {
        id: tasks.length + 1,
        title,
        description,
        due_Date,
        category,
        priority,
        complete: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

router.get('/change_status/:taskId', authenticateUser, (req, res) => {
    const taskId = parseInt(req.params.taskId);

        const task = tasks.find(task => task.id === taskId);
        task.complete = true

     res.json(task);
    
});


router.get('/get_allTasks', authenticateUser, (req, res) =>{

    res.json(tasks);

});


router.put('/assign_category/:taskId', authenticateUser, (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const { category } = req.body;

    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
        res.status(404).json({ message: 'Task isnot found' });
    } else {
        tasks[taskIndex].category = category;
        res.json(tasks[taskIndex]);
    }
});

router.get('/filter_category/:category', authenticateUser, (req, res) => {
    const category = req.params.category;
    const filteredTasks = tasks.filter(task => task.category === category);
    
    if (filteredTasks.length === 0) {
        res.status(404).json({ message: `No tasks was found in category '${category}'` });
    } else {
        res.json(filteredTasks);
    }
});


module.exports = router;
