const express=require('express');
const app=express();
const fs = require("fs");
const bodyParser=require('body-parser');
const LocalStorage = require('node-localstorage').LocalStorage
const _ = require("lodash");
const  contentRoutes=require('./router/content.js');
const  commentRoutes=require('./router/comment.js');
const localStorage = new LocalStorage('./statch');
let contents = fs.readFileSync("public/lib/json/people.json");
let people = JSON.parse(contents);
let contents1 = fs.readFileSync("public/lib/json/content.json");
let postExperienceDB = JSON.parse(contents1);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(contentRoutes);
app.use(commentRoutes);
let PORT=process.env.PORT || 3000;
app.post("/login", function(req, res) {
    console.log("Received")
   
    if(req.body.username && req.body.password){
      username = req.body.username;
       password= req.body.password;
    }
    let currentToken = {};
    let retrievedToken = localStorage.getItem('currentToken');
    let user = people[_.findIndex(people, {username: username})];
    if( ! user ){
      res.status(400).json({message:"no such user found"});
    }
    else{
    if(user.password === req.body.password) {
        if(username==="admin"){
            currentToken=setAccessToken(username,"concertina",currentToken);
            localStorage.setItem('currentToken', JSON.stringify(currentToken));
            user["access_token"]="concertina";
        }
        else{
            let access_token = getAccessToken();
            currentToken=setAccessToken(username,access_token,currentToken);
            localStorage.setItem('currentToken', JSON.stringify(currentToken));
            user["access_token"]=currentToken;
           
        }
      res.status(200).json(user);
    } else {
      res.status(400).json({message:"passwords did not match"});
    }
    }
  });
//post register
function checkTokenAddMember(req,res,next ){
    console.log("******")
    console.log(req.body)
    console.log(req.body.access_token)
            if(req.body.access_token==="concertina"){
                next();
            }
             else{
                res.status(403).json({message:"NO!"})
         }
        
}
        //register
app.post('/people',checkTokenAddMember,function(req,res,){
    console.log(req.body)
    let userUsername = people[_.findIndex(people, {username:req.body.username})]
    let userEmail=people[_.findIndex(people, {email:req.body.email})]
    if(userUsername){
        res.status(400).json({message: "Username taken!"});
    }
    if(userEmail){
        res.status(400).json({message: "Email taken!"});
    }
    else{
    let newPeople={
        username:req.body.username,
        forename:req.body.forename,
        surname:req.body.surname,
        email:req.body.email,
        password:req.body.password
    }
    if(req.body.admin==="Yes"){
        newPeople["access_token"]="concertina";
    }
    people.push(newPeople)
    fs.writeFileSync("public/lib/json/people.json", JSON.stringify(people,null,2));
    res.status(200).json({username:req.body.username});
    }
});
//
app.get('/logout',function(req,res,err){
    localStorage.clear();
    res.status(200).json(postExperienceDB);
});
//get list of people
app.get('/people',function(req,res,err){
        res.status(200).json(people);
});
//get specific people
app.get('/people/:username',function(req,res){
    username=req.params.username;
    let findUsername=people[_.findIndex(people, {username:username})]
    if(findUsername){
        res.status(200).json(findUsername)
    }
    else{
        res.status(400).json({message:"Error"});
    }
});
function findSpecificID(element,id){
    for (i = 0; i < element.length; i++) { 
        if(element[i].id===Number(id)){
            console.log(element[i]);
            return element[i];
        }
        else{
            return undefined;
        }
}
}
////function to assign id //##################################################
function assignID(element){
        let idArray=[];
        idArray.push(element);
        return Math.max(idArray);
}

function getAccessToken(){
    return Math.random().toString(36).substring()
}
function setAccessToken(username, access_token,currentToken){
    return usersAccessToken = {'username':username , 'access_token':access_token} 
}


module.exports = app;

    
