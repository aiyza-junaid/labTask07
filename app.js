const express = require('express');
const app = express();
const taskks = require('./routes');

app.use(express.json());

app.use('/tasks', taskks);


const PORT = 3000;

app.listen(PORT, () => {

  console.log(`Server is listening on port ${PORT}`);
});
