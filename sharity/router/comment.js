const express=require("express");
const router=express.Router();
const fs = require("fs");
const _ = require("lodash");
let contents = fs.readFileSync("./public/lib/json/people.json");
let people = JSON.parse(contents);
let contents1 = fs.readFileSync("./public/lib/json/content.json");
let postExperienceDB = JSON.parse(contents1);

router.post("/content/:id/comment",function(req,res){//nanti letak user
    let contentID=req.params.id;
    let commentContent=req.body.comment;
    let usernameComment=req.body.username;
    let resultArray=[];
    newComment={
        id:1,
        username:usernameComment,
        comment:commentContent
    }
    console.log(contentID)
    console.log(postExperienceDB)
    let value=findSpecificID(postExperienceDB,contentID);
    console.log(value);
    let commentArray=value.comment;
    if(commentArray.length){
        commentArray.forEach(function(e){
            newComment.id=e.id+1;
        })
       commentArray.push(newComment);
    }
    else if(!commentArray.length){
        commentArray.push(newComment);

    }
    fs.writeFileSync("public/lib/json/content.json", JSON.stringify(postExperienceDB,null,2));
    resultArray.push(value);
    resultArray.push(commentArray);
    resultArray.push(postExperienceDB);
    res.send(resultArray);
 });
 //DELETE COMMENT#############
router.delete('/content/:id/comment/:commentID',function(req,res){
    console.log(req.params)
    let resultArray=[];
    let contentID=Number(req.params.id);
    let commentID=Number(req.params.commentID);
    
    var content = _.find(postExperienceDB, { id:contentID });
    let found=false;
    content.comment.forEach(function(element,index){
        console.log(element.id);
        if(!found &&element.id===commentID){
          console.log(element.id);
            content.comment.splice(index,1);
            found=true;
        }
    });
    resultArray.push(content)
    resultArray.push(postExperienceDB);
     fs.writeFileSync("public/lib/json/content.json", JSON.stringify(postExperienceDB,null,2));
     res.send(resultArray);
});

function findSpecificID(element,id){
    for (i = 0; i < element.length; i++) { 
        if(element[i].id===Number(id)){
            console.log(element[i]);
            return element[i];
        }
}
}
module.exports=router;
