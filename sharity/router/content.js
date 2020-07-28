const express=require("express");
const router=express.Router();
const fs = require("fs");
let contents1 = fs.readFileSync("./public/lib/json/content.json");
let postExperienceDB = JSON.parse(contents1);

//get ALL  post ##################################################
router.get('/content',function(req,res){
    console.log("test");
        res.status(200).send(postExperienceDB);
    
});
//GET SPECIFIC POST
router.get('/content/:id',function(req,res){
    let contents2 = fs.readFileSync("./public/lib/json/content.json");
    let postDB = JSON.parse(contents1);
    let id=req.params.id;
    console.log(id);
    let found=false;
    postDB.forEach(function(content,index){
        if(!found&&content.id===Number(id)){
          result=postDB[index];
          found=true;
        }
    });
    res.send(result);
});
//##################################################
//Edit post
router.put('/content/:id',function(req,res){
    let id=req.params.id;
    let found=false;
    let result;
    let arrayDB=[];
    let description=req.body.description;
    let rating=req.body.rating;
    postExperienceDB.forEach(function(content,index){
        if(!found&&content.id===Number(id)){
            console.log("dec"+postExperienceDB[index].description);
            postExperienceDB[index].description=description;
            postExperienceDB[index].rating=rating;
            result= postExperienceDB[index]
            console.log("dec 222"+postExperienceDB[index].description);
            found=true;
        }
    });
    arrayDB.push(result);
   arrayDB.push(postExperienceDB);
    fs.writeFileSync("public/lib/json/content.json", JSON.stringify(postExperienceDB,null,2));
    res.send(arrayDB);
})
//Delete POST
router.delete('/content/:id',function(req,res){
    let id=req.params.id;
    let found=false;
    postExperienceDB.forEach(function(content,index){
        if(!found &&content.id===Number(id)){
            postExperienceDB.splice(index,1);
        }
    });
    res.send(postExperienceDB);
    fs.writeFileSync("public/lib/json/content.json", JSON.stringify(postExperienceDB,null,2));
});
//add new post ##################################################
router.post('/content',addContent);
//function for new post // ##################################################
function addContent(req, res)
{   let currentID=1
    console.log("Data Received : "+req.body);
    let newContent =
    {   id:currentID,
        username : req.body.username,
        title:req.body.title,
        description: req.body.description,
        picture: req.body.picture,
        rating:req.body.rating,
        comment:[]
    };
   
    if(postExperienceDB.length){
        postExperienceDB.forEach(function(e) {
            newContent.id=e.id+1;
        });
        postExperienceDB.push(newContent);
    }
    else if(!postExperienceDB.length){
        postExperienceDB.push(newContent);
    }
    fs.writeFileSync("public/lib/json/content.json", JSON.stringify(postExperienceDB,null,2));
    res.send(postExperienceDB);
    }

    module.exports=router;
    