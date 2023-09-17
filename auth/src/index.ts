import express from 'express';

const app = express();

app.use(express.json());
const PORT = 3000;

app.get('/api/users/currentuser', (req, res) => {
    res.send('hi there');
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});