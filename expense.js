const express = require('express');
const router = express.Router();
const connection = require('./connection');

//======================================================= notes



// api insert into database

router.post('/create-expense',(req,res)=>{
    const {expense,expense_reason,status}=req.body;
    connection.query("INSERT INTO payments(expense,expense_reason,status,create_at) VALUES (?,?,?,NOW())",[expense,expense_reason,status],(err,result)=>{
        if(err){
            console.error('DATABASEN insert error',err);
            return res.status(500).json({message:"Failed to insert"});
        }
        res.status(201).json({message:'insert Successfully'});
    });
});



// API select data

router.get('/select-expense',(req,res)=>{
    connection.query("SELECT id,expense,expense_reason,status,create_at,update_at FROM payments WHERE income IS NULL ORDER BY id DESC",(err,result)=>{
        if(err){
            console.error('Data select error',err);
            return res.status(404).json({message:'Data error'});
        }
        if(result===0){
            return res.status(404).json({message:"module not found"});
        }
        res.status(200).json(result);
    });
});

// API select data

router.get('/select-expense_limit',(req,res)=>{
    connection.query("SELECT id,expense,expense_reason,status,create_at,update_at FROM payments WHERE income IS NULL ORDER BY id DESC LIMIT 5",(err,result)=>{
        if(err){
            console.error('Data select error',err);
            return res.status(404).json({message:'Data error'});
        }
        if(result===0){
            return res.status(404).json({message:"module not found"});
        }
        res.status(200).json(result);
    });
});



//API select  by id

router.get("/select_expenseid/:id",(req,res)=>{
    const {id} = req.params;
    connection.query("SELECT id,expense,expense_reason,status FROM payments WHERE income IS NULL AND id=?",[id],(err,result)=>{
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


// API update DATA

router.put("/update-expense/:id",(req,res)=>{
    const {id} = req.params;
    const {expense,expense_reason,status}=req.body;
   
    connection.query("UPDATE payments SET expense=?,expense_reason=?,status=?,update_at=NOW() WHERE id=?",[expense,expense_reason,status,id],(err,result)=>{
        if(err){
            console.error('Data update error',err);
            return res.status(500).json({message:"DATA update arror",err});

        }if(result.affectedRows===0){
            console.error('data update found');
            return res.status(500).json({message:"DATA update found"});
        }
        res.status(200).json({message:"Updated"});
    });
})


//api delete data

router.delete('/delete-expense/:id',(req,res)=>{
    const delete_id = req.params.id;
connection.query("DELETE from payments WHERE id=?",[delete_id],(err,result)=>{
    if(err){
        console.error("Delete error",err);
        return res.status(500).json({message:"delete error!",err});
    }if(result.affectedRows===0){
        return res.status(404).json({message:"note not found"});
    }
    res.status(200).json({message:"DELETE successfully"});
})
});



////api search data 


router.get('/search-expense', (req, res) => {
    const { expense,expense_reason,status} = req.query;

    let query = "SELECT id,expense,expense_reason,status FROM payments WHERE income IS NULL AND 1=1";
    let params = [];

    if (expense) {
        query += ' AND expense = ?';
        params.push(expense);
    }
    if (expense_reason) {
        query += ' AND expense_reason = ?';
        params.push(expense_reason);
    }
    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Database search error', err);
            return res.status(500).json({ message: "Failed to search" });
        }
        res.status(200).json(results);
    });
});



module.exports = router;