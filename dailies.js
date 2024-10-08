const express = require('express');
const router = express.Router();
const connection = require('./connection');

//======================================================= notes



// api insert into database

router.post('/create-dailie',(req,res)=>{
    const {dailies_name,dailies_date,dailies_stime,dailies_etime,remark}=req.body;
    connection.query("INSERT INTO dailies(dailies_name,dailies_date,dailies_stime,dailies_etime,dailies_status,remark,create_at,dailies_delete) VALUES (?,?,?,?,0,?,NOW(),0)",[dailies_name,dailies_date,dailies_stime,dailies_etime,remark],(err,result)=>{
        if(err){
            console.error('DATABASEN insert error',err);
            return res.status(500).json({message:"Failed to insert"});
        }
        res.status(201).json({message:'insert Successfully'});
    });
});



// API select data all

router.get('/select-dailie',(req,res)=>{
    connection.query("SELECT * FROM dailies WHERE dailies_delete=0",(err,result)=>{
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



// API select data all

router.get('/select-dailie_recover',(req,res)=>{
    connection.query("SELECT * FROM dailies WHERE dailies_delete='1'",(err,result)=>{
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

router.get('/select-dailie-success',(req,res)=>{
    connection.query("SELECT * FROM dailies WHERE dailies_status=1 AND dailies_delete='0'",(err,result)=>{
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

router.get('/select-dailie-not-success',(req,res)=>{
    connection.query("SELECT * FROM dailies WHERE dailies_status=0 AND dailies_delete='0'",(err,result)=>{
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

router.get("/select_dailieid/:id",(req,res)=>{
    const {id} = req.params;
    connection.query("SELECT * FROM dailies WHERE id=?",[id],(err,result)=>{
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

router.put("/update-dailie/:id",(req,res)=>{
    const {id} = req.params;
    const {dailies_name,dailies_date,dailies_stime,dailies_etime,dailies_status,remark}=req.body;
   
    connection.query("UPDATE dailies SET dailies_name=?,dailies_date=?,dailies_stime=?,dailies_etime=?,dailies_status=?,remark=?,update_at=NOW() WHERE id=?",[dailies_name,dailies_date,dailies_stime,dailies_etime,dailies_status,remark,id],(err,result)=>{
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

router.delete('/delete-dailie/:id',(req,res)=>{
    const delete_id = req.params.id;
connection.query("UPDATE dailies SET dailies_delete=1 WHERE id=?",[delete_id],(err,result)=>{
    if(err){
        console.error("Delete error",err);
        return res.status(500).json({message:"delete error!",err});
    }if(result.affectedRows===0){
        return res.status(404).json({message:"note not found"});
    }
    res.status(200).json({message:"DELETE successfully"});
})
});



//api delete data

router.delete('/delete-dailie_really/:id',(req,res)=>{
    const delete_id = req.params.id;
connection.query("DELETE from dailies WHERE id=?",[delete_id],(err,result)=>{
    if(err){
        console.error("Delete error",err);
        return res.status(500).json({message:"delete error!",err});
    }if(result.affectedRows===0){
        return res.status(404).json({message:"note not found"});
    }
    res.status(200).json({message:"DELETE successfully"});
})
});



//api delete data

router.delete('/delete-dailie_recover/:id',(req,res)=>{
    const delete_id = req.params.id;
connection.query("UPDATE dailies SET dailies_delete=0 WHERE id=?",[delete_id],(err,result)=>{
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


router.get('/search-dailie', (req, res) => {
    const { dailies_date} = req.query;

    let query = "SELECT * FROM dailies WHERE 1=1 AND dailies_delete=0";
    let params = [];

    if (dailies_date) {
        query += ' AND dailies_date = ?';
        params.push(dailies_date);
    }
    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Database search error', err);
            return res.status(500).json({ message: "Failed to search" });
        }
        res.status(200).json(results);
    });
});


////api search data 


router.get('/search-dailie_recover', (req, res) => {
    const { dailies_date} = req.query;

    let query = "SELECT * FROM dailies WHERE 1=1 AND dailies_delete=1";
    let params = [];

    if (dailies_date) {
        query += ' AND dailies_date = ?';
        params.push(dailies_date);
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
router.get('/search-dailie-success', (req, res) => {
    const { dailies_date} = req.query;

    let query = "SELECT * FROM dailies WHERE dailies_status=1 AND dailies_delete=0 AND 1=1";
    let params = [];

    if (dailies_date) {
        query += ' AND dailies_date = ?';
        params.push(dailies_date);
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
router.get('/search-dailie-notsuccess', (req, res) => {
    const { dailies_date} = req.query;

    let query = "SELECT * FROM dailies WHERE dailies_status=0 AND dailies_delete=0 AND 1=1";
    let params = [];

    if (dailies_date) {
        query += ' AND dailies_date = ?';
        params.push(dailies_date);
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