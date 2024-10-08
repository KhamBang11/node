const express = require('express');
const router = express.Router();
const connection = require('./connection');

//======================================================= notes



// api insert into database

router.post('/create-plan',(req,res)=>{
    const {name,percent}=req.body;
    connection.query("INSERT INTO plans(name,percent,create_at) VALUES (?,?,NOW())",[name,percent],(err,result)=>{
        if(err){
            console.error('DATABASEN insert error',err);
            return res.status(500).json({message:"Failed to insert"});
        }
        res.status(201).json({message:'insert Successfully'});
    });
});



// API select data all

router.get('/select-plan',(req,res)=>{
    connection.query("SELECT * FROM plans",(err,result)=>{
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



// API select data success

router.get('/select-plan-success',(req,res)=>{
    connection.query("SELECT * FROM plans WHERE status=1",(err,result)=>{
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



// API select data not-success

router.get('/select-plan-not-success',(req,res)=>{
    connection.query("SELECT * FROM plans WHERE status=0",(err,result)=>{
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

router.get("/select_planid/:id",(req,res)=>{
    const {id} = req.params;
    connection.query("SELECT * FROM plans WHERE id=?",[id],(err,result)=>{
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

router.put("/update-plan/:id",(req,res)=>{
    const {id} = req.params;
    const {name,percent,active,status}=req.body;
   
    connection.query("UPDATE plans SET name=?,percent=?,active=?,status=?,update_at=NOW() WHERE id=?",[name,percent,active,status,id],(err,result)=>{
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

router.delete('/delete-plan/:id',(req,res)=>{
    const delete_id = req.params.id;
connection.query("DELETE from plans WHERE id=?",[delete_id],(err,result)=>{
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


router.get('/search-plan', (req, res) => {
    const { name} = req.query;

    let query = "SELECT * FROM plans WHERE 1=1";
    let params = [];

    if (name) {
        query += ' AND name = ?';
        params.push(name);
    }
    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Database search error', err);
            return res.status(500).json({ message: "Failed to search" });
        }
        res.status(200).json(results);
    });
});


////// succes
router.get('/search-plan-success', (req, res) => {
    const { name} = req.query;

    let query = "SELECT * FROM plans WHERE status=1 AND 1=1";
    let params = [];

    if (name) {
        query += ' AND name = ?';
        params.push(name);
    }
    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Database search error', err);
            return res.status(500).json({ message: "Failed to search" });
        }
        res.status(200).json(results);
    });
});


////// not succes
router.get('/search-plan-notsuccess', (req, res) => {
    const { name} = req.query;

    let query = "SELECT * FROM plans WHERE status=0 AND 1=1";
    let params = [];

    if (name) {
        query += ' AND name = ?';
        params.push(name);
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



// API select data all

router.get('/select-plan_count',(req,res)=>{
    connection.query("SELECT COUNT(id) AS plan_id FROM plans",(err,result)=>{
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



// API select data all

router.get('/select-plan_count_success',(req,res)=>{
    connection.query("SELECT COUNT(id) AS plan_id FROM plans WHERE status=1",(err,result)=>{
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




// API select data all

router.get('/select-plan_count_notsuccess',(req,res)=>{
    connection.query("SELECT COUNT(id) AS plan_id FROM plans WHERE status=0",(err,result)=>{
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