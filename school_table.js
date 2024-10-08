const express = require('express');
const router = express.Router();
const connection = require('./connection');


//======================================================= modules



// api create module

router.post('/create-schooltable',(req,res)=>{
    const {time_one,time_two,time_three,time_four,day,sdate,edate}=req.body;
    connection.query("INSERT INTO school_table(time_one,time_two,time_three,time_four,day,sdate,edate,create_at) VALUES (?,?,?,?,?,?,?,NOW())",[time_one,time_two,time_three,time_four,day,sdate,edate],(err,result)=>{
        if(err){
            console.error('DATABASEN insert error',err);
            return res.status(500).json({message:"Failed to insert module"});
        }
        res.status(201).json({message:'module insert Successfully'});
    });
});

// API select module

router.get('/select-schooltable',(req,res)=>{
    connection.query("SELECT * FROM school_table",(err,result)=>{
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


//api delete module

router.delete('/delete-schooltable/:id',(req,res)=>{
    const delete_id = req.params.id;
connection.query("DELETE from school_table WHERE id=?",[delete_id],(err,result)=>{
    if(err){
        console.error("Delete error",err);
        return res.status(500).json({message:"delete error!",err});
    }if(result.affectedRows===0){
        return res.status(404).json({message:"module not found"});
    }
    res.status(200).json({message:"DELETE successfully"});
})
});

////api search data of module


router.get('/search-schooltable', (req, res) => {
    const { day} = req.query;

    let query = "SELECT * FROM school_table WHERE 1=1";
    let params = [];

    if (day) {
        query += ' AND day = ?';
        params.push(day);
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Database search error', err);
            return res.status(500).json({ message: "Failed to search" });
        }
        res.status(200).json(results);
    });
});




//API select module by id

router.get("/select_schooltableid/:id",(req,res)=>{
    const {id} = req.params;
    connection.query("SELECT * FROM school_table WHERE id=?",[id],(err,result)=>{
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

// API update module

router.put("/update-schooltable/:id",(req,res)=>{
    const {id} = req.params;
    const {time_one,time_two,time_three,time_four,day,sdate,edate}=req.body;
   
    connection.query("UPDATE school_table SET time_one=?,time_two=?,time_three=?,time_four=?,day=?,sdate=?,edate=?,update_at=now() WHERE id=?",[time_one,time_two,time_three,time_four,day,sdate,edate,id],(err,result)=>{
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

module.exports = router;