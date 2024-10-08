const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rediscreateClient = require('redis').createClient();
const port = 3000
const app = express();
const connection = require('./connection');
const use_user = require('./user');
const use_module = require('./module');
const use_note = require('./note');
const use_payment = require('./payment');
const use_expense = require('./expense');
const use_plan = require('./plan');
const use_school_table = require('./school_table');
const use_dailies = require('./dailies');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api',use_user);
app.use('/api',use_module);
app.use('/api',use_note);
app.use('/api',use_payment);
app.use('/api',use_expense);
app.use('/api',use_plan);
app.use('/api',use_school_table);
app.use('/api',use_dailies);

// API Register
app.post('/register', async (req, res) => {
    const { username, email, password, phone } = req.body;

    connection.query('SELECT * FROM users WHERE phone = ?', [phone], async (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(404).json({ message: 'Database query error' });
        }
        if (result.length > 0) return res.status(400).json({ message: 'User already exists' });

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            connection.query('INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, phone], (err, result) => {
                if (err) {
                    console.error('Database insert error:', err);
                    return res.status(404).json({ message: 'Failed to register user' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            });
        } catch (error) {
            console.error('Password hashing error:', error);
            res.status(404).json({ message: 'Internal server error' });
        }
    });
});

// API Login
app.post('/login', (req, res) => {
    const {phone, password} = req.body;

    connection.query('SELECT * FROM users WHERE phone = ?', [phone], async (err, result) => {
        if (err) throw err;
        if (result.length === 0) return res.status(400).json({message: "Invalid"});

        const user = result[0];

        const IsMatch = await bcrypt.compare(password, user.password);
        if(!IsMatch) return res.status(400).json({message: 'Invalid'});

        const token = jwt.sign({id: user.id}, process.env.SECRET_JWT, {expiresIn: '2h'});
        res.json({
            message: "Login successfully",
            token: token
        });
    });
});


app.listen(port, ()=>{
    console.log('Server is running on port 3000');
});


app.post('/logout',(req,res)=>{
    const token = req.headers['authorization'].split('')[1];
    const decode = jwt.decode(token);
    const expiresIn = decode.exp-Math.floor(Date.now()/100);
    rediscreateClient.setEx(token,expiresIn,'blacklisted',(err)=>{
        if(err) return res.status(500).json({message:"Logout failed"});
        res.json({message:"logouted"});
    })
})
