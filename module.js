const express = require('express');
const router = express.Router();
const connection = require('./connection');


//======================================================= modules



// api create module

router.post('/create-module',(req,res)=>{
    const {module_name}=req.body;
    connection.query("INSERT INTO modules(module_name,create_at) VALUES (?,NOW())",[module_name],(err,result)=>{
        if(err){
            console.error('DATABASEN insert error',err);
            return res.status(500).json({message:"Failed to insert module"});
        }
        res.status(201).json({message:'module insert Successfully'});
    });
});

// API select module

router.get('/select-module',(req,res)=>{
    connection.query("SELECT * FROM modules",(err,result)=>{
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

router.delete('/delete-module/:id',(req,res)=>{
    const delete_id = req.params.id;
connection.query("DELETE from modules WHERE id=?",[delete_id],(err,result)=>{
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


router.get('/search-module', (req, res) => {
    const { module_name} = req.query;

    let query = "SELECT * FROM modules WHERE 1=1";
    let params = [];

    if (module_name) {
        query += ' AND module_name = ?';
        params.push(module_name);
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

router.get("/select_moduleid/:id",(req,res)=>{
    const {id} = req.params;
    connection.query("SELECT * FROM modules WHERE id=?",[id],(err,result)=>{
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

router.put("/update-module/:id",(req,res)=>{
    const {id} = req.params;
    const {module_name}=req.body;
   
    connection.query("UPDATE modules SET module_name=?,update_at=NOW() WHERE id=?",[module_name,id],(err,result)=>{
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