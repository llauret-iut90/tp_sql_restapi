const express = require('express');

const stageRoutes = require('./src/stages/routes');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`Salut à toi jeune entrepreneur!`);
});

app.use('/api/tp_sql', stageRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port} \n
    http://localhost:${port} \n`,
        'http://localhost:3000/api/tp_sql');
});