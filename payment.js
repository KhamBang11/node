const express = require('express');
const router = express.Router();
const connection = require('./connection');

//======================================================= notes



// api insert into database

router.post('/create-income',(req,res)=>{
    const {income,income_reason,status}=req.body;
    connection.query("INSERT INTO payments(income,income_reason,status,create_at) VALUES (?,?,?,NOW())",[income,income_reason,status],(err,result)=>{
        if(err){
            console.error('DATABASEN insert error',err);
            return res.status(500).json({message:"Failed to insert"});
        }
        res.status(201).json({message:'insert Successfully'});
    });
});



// API select data

router.get('/select-income',(req,res)=>{
    connection.query("SELECT id,income,income_reason,status,create_at,update_at FROM payments WHERE expense IS NULL ORDER BY id DESC",(err,result)=>{
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

router.get("/select_incomeid/:id",(req,res)=>{
    const {id} = req.params;
    connection.query("SELECT id,income,income_reason,status FROM payments WHERE expense IS NULL AND id=?",[id],(err,result)=>{
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

router.put("/update-income/:id",(req,res)=>{
    const {id} = req.params;
    const {income,income_reason,status}=req.body;
   
    connection.query("UPDATE payments SET income=?,income_reason=?,status=?,update_at=NOW() WHERE id=?",[income,income_reason,status,id],(err,result)=>{
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

router.delete('/delete-income/:id',(req,res)=>{
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


router.get('/search-income', (req, res) => {
    const { income,income_reason,status} = req.query;

    let query = "SELECT id,income,income_reason,status,create_at,update_at FROM payments WHERE expense IS NULL AND 1=1";
    let params = [];

    if (income) {
        query += ' AND income = ?';
        params.push(income);
    }
    if (income_reason) {
        query += ' AND income_reason = ?';
        params.push(income_reason);
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


/////////////////////// for show dashboard




// API select data income

router.get('/select-sumincome',(req,res)=>{
    connection.query("SELECT SUM(income) AS sum_income FROM payments",(err,result)=>{
        if(err){
            console.error('Data select error',err);
            return res.status(404).json({message:'Data error'});
        }
        if(result===0){
            return res.status(404).json({message:"module not found"});
        }
        res.status(200).json({sum_income:result[0].sum_income});
    });
});




// API select data income today

router.get('/select-sumincome_today',(req,res)=>{
    connection.query("SELECT SUM(income) AS sum_income FROM payments WHERE DATE(STR_TO_DATE(create_at,'%Y-%m-%d %H:%i:%s'))=CURDATE()",(err,result)=>{
        if(err){
            console.error('Data select error',err);
            return res.status(404).json({message:'Data error'});
        }
        if(result===0){
            return res.status(404).json({message:"module not found"});
        }
        res.status(200).json({sum_income:result[0].sum_income});
    });
});



// API select data expense today

router.get('/select-sumexpense_today',(req,res)=>{
    connection.query("SELECT SUM(expense) AS sum_expense FROM payments WHERE DATE(STR_TO_DATE(create_at,'%Y-%m-%d %H:%i:%s'))=CURDATE()",(err,result)=>{
        if(err){
            console.error('Data select error',err);
            return res.status(404).json({message:'Data error'});
        }
        if(result===0){
            return res.status(404).json({message:"module not found"});
        }
        res.status(200).json(result[0]);
    });
});

// API select data expense

router.get('/select-sumexpense',(req,res)=>{
    connection.query("SELECT SUM(expense) AS sum_expense FROM payments",(err,result)=>{
        if(err){
            console.error('Data select error',err);
            return res.status(404).json({message:'Data error'});
        }
        if(result===0){
            return res.status(404).json({message:"module not found"});
        }
        res.status(200).json(result[0]);
    });
});





// API select data expense

router.get('/select-remainings',(req,res)=>{
    connection.query("SELECT SUM(income)-SUM(expense) AS remainings FROM payments",(err,result)=>{
        if(err){
            console.error('Data select error',err);
            return res.status(404).json({message:'Data error'});
        }
        if(result===0){
            return res.status(404).json({message:"module not found"});
        }
        res.status(200).json(result[0]);
    });
});


module.exports = router;