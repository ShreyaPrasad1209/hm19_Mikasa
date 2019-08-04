const express = require('express');
const bodyparser = require ('body-parser');
const config = require('config');
 const app = express();

// app.get('/',(req,res)=>{
//     res.send('Hello World');
//     })
app.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname+'/index.html'));
})
app.use(express.static(__dirname + '/view'));


const PORT =5000;
app.listen(PORT,()=>{
    console.log(`Sever is running at port number ${PORT}`);
})