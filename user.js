const express = require('express');
const router = express.Router();
const connection = require('./connection');


// api create admin

router.post('/create-admin',(req,res)=>{
    const {username,email,password,phone}=req.body;
    const hashedPassword = bcrypt.hashSync(password,10);
    connection.query("INSERT INTO users(username,email,password,phone,created_at) VALUES (?,?,?,?,NOW())",[username,email,hashedPassword,phone],(err,result)=>{
        if(err){
            console.error('DATABASEN insert error',err);
            return res.status(500).json({message:"Failed to insert admi"});
        }
        res.status(201).json({message:'Admin insert Successfully'});
    });
});


// API select

router.get('/select-admin',(req,res)=>{
    connection.query("SELECT * FROM users",(err,result)=>{
        if(err){
            console.error('Data select error',err);
            return res.status(404).json({message:'Data error'});
        }
        if(result===0){
            return res.status(404).json({message:"user not found"});
        }
        res.status(200).json(result);
    });
});

//api delete

router.delete('/delete-admin/:id',(req,res)=>{
    const delete_id = req.params.id;
connection.query("DELETE from users WHERE id=?",[delete_id],(err,result)=>{
    if(err){
        console.error("Delete error",err);
        return res.status(500).json({message:"delete error!",err});
    }if(result.affectedRows===0){
        return res.status(404).json({message:"user not found"});
    }
    res.status(200).json({message:"DELETE successfully"});
})
});

// api search admin

// router.get('/search-admin',(req,res)=>{
// const {username,email,phone} = req.body;
// let sql = "SELECT * FROM users WHERE 1=1";
// let params = [];
// // if(user){
// //     sql+='AND username LIKE ?';
// //     params.push(`%${user}%`);
// // }
// // if(email){
// //     sql+='AND email LIKE ?';
// //     params.push(`%${email}%`);
// // }
// // if(phone){
// //     sql+='AND phone LIKE ?';
// //     params.push(`%${phone}%`);
// // }
// if(username){
//     sql+='AND username = ?';
//     params.push(`%${username}%`);
// }
// if(email){
//     sql+='AND email = ?';
//     params.push(`%${email}%`);
// }
// if(phone){
//     sql+='AND phone = ?';
//     params.push(`%${phone}%`);
// }
// connection.query(sql,params,(err,result)=>{
//     if(err){
//         console.error("Data search arror",err);
//         return res.status(500).json({message:"Failed to search",err});
//     }
//     res.status(200).json(result);
// });
// });

router.get('/search-admin', (req, res) => {
    const { username, email, phone } = req.query;

    let query = "SELECT * FROM users WHERE 1=1";
    let params = [];

    if (username) {
        query += ' AND username = ?';
        params.push(username);
    }
    if (email) {
        query += ' AND email = ?';
        params.push(email);
    }
    if (phone) {
        query += ' AND phone = ?';
        params.push(phone);
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Database search error', err);
            return res.status(500).json({ message: "Failed to search" });
        }
        res.status(200).json(results);
    });
});

//API select user b id

router.get("/select_id/:id",(req,res)=>{
    const {id} = req.params;
    connection.query("SELECT * FROM users WHERE id=?",[id],(err,result)=>{
        if(err){
            console.error('Data select error',err);
            return res.status(500).json({message:"DATA select arror",err});

        }if(result.length===0){
            console.error('data Not found');
            return res.status(500).json({message:"DATA Not found"});
        }
        res.status(200).json(result[0]);
    });
})

// API update user

router.put("/update-user/:id",(req,res)=>{
    const {id} = req.params;
    const {username,email,phone,password}=req.body;
    const hsah_pass = bcrypt.hashSync(password,10);
    connection.query("UPDATE users SET username=?,email=?,phone=?,password=?,updated_at=NOW() WHERE id=?",[username,email,phone,hsah_pass,id],(err,result)=>{
        if(err){
            console.error('Data update error',err);
            return res.status(500).json({message:"DATA update arror",err});

        }if(result.affectedRows===0){
            console.error('data update found');
            return res.status(500).json({message:"DATA update found"});
        }
        res.status(200).json({message:"Updated"});
    });
});
module.exports = router;