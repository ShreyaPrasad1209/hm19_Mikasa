// npm i karna tha --save se package.json mei changes dikh jayengi?
// abhi bhi error aayenge kyu
// jab hum clone karte hai toh khud se packages install nhi karte npm i se joh package.json mai joh bhi hota hai voh install ho jata hai ok
// hogya  yes! but isme bootstrap kyu nhi aa rha h ? :O
const express = require('express');
const bodyparser = require ('body-parser');
const config = require('config');
const app = express();
const path = require("path");
const PORT =5000;
const users = require("./routes/users");

app.set('view engine', 'ejs');  //yaha error throw kar rha h
app.use(express.static(__dirname+ '/public'));
// app.use('/css', express.static(path.join(__dirname,'/public/stylesheets')));
app.get('/',(req,res)=>{
    res.send('Hello World');
    })
app.get('/home',(req,res)=>{
    res.sendFile("index.html");
})

app.use('/users',users);

app.listen(PORT,()=>{
    console.log(`Sever is running at port number ${PORT}`);
})

//ispar node chal kyu nhi raha hai?
// hogya
//acha tune nodemon daala tha pehle?? but isme css nhi aa rhi h saari :\
// css load horahi hai but css hi galat hai
// haan css hi galat hai
//abhi kya kya theek karna h isme?
// bhot kuch nhi hopayega
// mujhe abhi padna bhi hai acha wo i'll see but login.ejs se connect ho rha h?