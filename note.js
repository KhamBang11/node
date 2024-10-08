const express = require('express');
const router = express.Router();
const connection = require('./connection');


//======================================================= notes



// api create notes

router.post('/create-note',(req,res)=>{
    const {content,module_id}=req.body;
    connection.query("INSERT INTO notes(content,module_id,create_at) VALUES (?,?,NOW())",[content,module_id],(err,result)=>{
        if(err){
            console.error('DATABASEN insert error',err);
            return res.status(500).json({message:"Failed to insert"});
        }
        res.status(201).json({message:'insert Successfully'});
    });
});

// API select note

router.get('/select-note',(req,res)=>{
    connection.query("SELECT notes.id,notes.content, modules.module_name FROM notes JOIN modules ON  notes.module_id = modules.id;",(err,result)=>{
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


//api delete note

router.delete('/delete-note/:id',(req,res)=>{
    const delete_id = req.params.id;
connection.query("DELETE from notes WHERE id=?",[delete_id],(err,result)=>{
    if(err){
        console.error("Delete error",err);
        return res.status(500).json({message:"delete error!",err});
    }if(result.affectedRows===0){
        return res.status(404).json({message:"note not found"});
    }
    res.status(200).json({message:"DELETE successfully"});
})
});


////api search data of module


router.get('/search-note', (req, res) => {
    const {content} = req.query;

    let query = "SELECT notes.id,notes.content, modules.module_name FROM notes JOIN modules ON  notes.module_id = modules.id WHERE 1=1";
    let params = [];

    if (content) {
        query += ' AND notes.content = ?';
        params.push(content);
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Database search error', err);
            return res.status(500).json({ message: "Failed to search" });
        }
        res.status(200).json(results);
    });
});





////api search data of module


router.get('/search-module_id', (req, res) => {
    const {module_id} = req.query;

    let query = "SELECT notes.id,notes.content, modules.module_name FROM notes JOIN modules ON  notes.module_id = modules.id WHERE 1=1";
    let params = [];

    if (module_id) {
        query += ' AND module_id = ?';
        params.push(module_id);
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Database search error', err);
            return res.status(500).json({ message: "Failed to search" });
        }
        res.status(200).json(results);
    });
});


//API select  by id

router.get("/select_noteid/:id",(req,res)=>{
    const {id} = req.params;
    connection.query("SELECT notes.id,notes.content,notes.module_id, modules.module_name FROM notes JOIN modules ON  notes.module_id = modules.id WHERE notes.id=?",[id],(err,result)=>{
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

// API update data

router.put("/update-note/:id",(req,res)=>{
    const {id} = req.params;
    const {note_name,module_id}=req.body;
   
    connection.query("UPDATE notes SET module_id=?,content=?,update_at=NOW() WHERE id=?",[module_id,note_name,id],(err,result)=>{
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

const income = 5000;
const expense = 2500;



module.exports = router;
