import express from 'express';
import { connection } from './Database/db.js';
import { router } from './route/userRoute.js';

const app = express();

connection();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('FindGuard Server is running');
});

app.use("/api/users",router);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
