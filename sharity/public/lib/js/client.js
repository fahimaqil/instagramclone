$(document).ready(function(){
    let postDB=new Object();

    let userStatus=localStorage.getItem('currentUser');
    if(userStatus!==null&&userStatus!=="admin"){
        $('#signupButton').toggle();
        $('#loginButton').toggle();
        $('#logoutButton').toggle();
        let user=$('#myPost');
        user.html('');
        user.append('\
        <h4 id="userNav"class="nav-link" href="#">'+userStatus+'</h4>\
    ')
    }
    else if(userStatus==="admin"){
        $('#loginButton').toggle();
        $('#logoutButton').toggle();
        let user=$('#myPost');
        user.html('');
        user.append('\
        <h4 id="userNav"class="nav-link" href="#">'+userStatus+'</h4>\
    ')
    }
    if(userStatus===null){
        userStatus="anonymous";
        $("signupButton").hide();
    }
    //let's share button
    $('.formButton').on('click',function(){
        if(userStatus==="anonymous"){
            addStatus("Please login/register to post!")
        }
        else{
       document.getElementById('username').value=userStatus;

        $('html, body').animate({ scrollTop: 0 }, 'slow', function () {
        });
        $('#post').toggle();
    }
    });
    //sign up form
    $('#loginButton').on('click',function(){

        $('html, body').animate({ scrollTop: 0 }, 'slow', function () {
        });
        $('#signup').hide();

        $('#login').toggle();
    
    });
        //let's explore button

    $('#exploreButton').on('click',function(){
        $('html, body').animate({ scrollTop: 0 }, 'slow', function () {
        });
            $(".carousel").toggle() 
    });
    $('#signupButton').on('click',function(){
        $('html, body').animate({ scrollTop: 0 }, 'slow', function () {
        });
        $('#login').hide();
        $('#signup').toggle();
    });
    //toggle view
    $('.togglerView').on('click',function(){
        $('html, body').animate({ scrollTop: 0 }, 'slow', function () {
        });
            $(".carousel").toggle() 
    });
    //hide modal after commenting
    $('#ModalComment').on('hide.bs.modal', function(event)
{
     var btnMergeField = $(this).find('#addComment');
     btnMergeField.unbind("click");
});
    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('.modal-title').text('New message to ' + recipient)
        modal.find('.modal-body input').val(recipient)
      })
    let toggler=true;
    //toggle thumbnail
    $('.togglerPic').on('click',function(){
        if(toggler){
            $(".col-lg-12").addClass("col-lg-4");
            $(".col-lg-12").removeClass("col-lg-12");
            $("#gallery p").css("font-size","0.3em");
    
            toggler=false;
        }
        else if(!toggler){
            $(".col-lg-4").addClass("col-lg-12");
            $(".col-lg-4").removeClass("col-lg-14");
            $("#gallery p").css("font-size","0.9em");
            toggler=true;
        }
    });

    //GET people
    $('.listAuthor').on('click',function(){
        $.ajax({
            url:'/people',
            method:'GET',
            contentType:'application/json',
            success:function(response){
                console.log(response)
                addPeople(response);
            }
        });
    });
    //GET SPECIFIC PEOPLE 
    $('#newContent').on('click','.list-group-item',function(){
        let fired_button= $(this).attr("id");
       console.log(fired_button);
        $.ajax({
        url:'people/'+fired_button,
        method:'GET',
        contentType:'application/json',
        success: function(response){
            let array=[];
            postDB.forEach(function(e){
                if(e.username===response.username){
                    array.push(e);
                }
            })
            if(array.length===0){
                let content=$("#newContent");
                content.html(" ");
                content.append('\
                <div class="container"><h3 class="text-center">No Post By Author</h3></div>\
                 <h6 class="text-center">Profile '+response.username+'</h6>\
                 <h6 class="text-center">Forename: '+response.forename+'</h6>\
                 <h6 class="text-center">Surname: '+response.surname+'</h6>\</div>\
                ')
            }
            else{
                addPeopleContent(response,array);
            }
                 }
                });
        });
    //GET USER THROUGH NAVBAR
     $('.navbar').on('click','#userNav',function(){
        let fired_button=  $(this).text();
       console.log(fired_button);
        $.ajax({
        url:'people/'+fired_button,
        method:'GET',
        contentType:'application/json',
        success: function(response){
            let array=[];
            postDB.forEach(function(e){
                if(e.username===response.username){
                    array.push(e);
                }
            })
            if(array.length===0){
                let content=$("#newContent");
                content.html(" ");
                content.append('\
                <div class="container"><h3 class="text-center">No Post By Author</h3></div>\
                 <h6 class="text-center">Username: '+response.username+'</h6>\
                 <h6 class="text-center">Forename: '+response.forename+'</h6>\
                 <h6 class="text-center">Surname: '+response.surname+'</h6>\</div>\
                ')
            }
            else{
            addPeopleContent(response,array);
            }
                 }
                });
        });
    
    //GET request for general post (success)//###########################################################################################################
    $(document).ready(function(){
        $.ajax({
            url:'/content',
            method:'GET',
            contentType:'application/json',
            success:function(response){
                addContent(response);
                 postDB=response;
                }
        });
     });
     // GET SPECIFIC POST (success)###########################################
     
     $('#newContent').on('click','#moreInfo',function(){
        let fired_button= $(this).attr("value");
        let result=new Object();
        postDB.forEach(function(event){
            if(Number(event.id)===Number(fired_button)){     
            result= event;
            return false;     
            }
         });
        if( typeof result === 'undefined' ||result === null){
            alert("Error")
          }
        
        else{
                $.ajax({
                url:'content/'+fired_button,
                method:'GET',
                contentType:'application/json',
                success: function(response){
                    console.log(response.comment);
                    addContentWithComment(response,response.comment);
                 }
                });
            
             };
        });
     //EDIT POST (success)##################################### //###########################################################################################################
     $('#newContent').on('click','.edit',function(){
        let fired_button= $(this).attr("value");
        let result=new Object();
        postDB.forEach(function(event){
            
            if(Number(event.id)===Number(fired_button)){
                
                result= event;
              return false;
               
            }  
        });
        if( typeof result === 'undefined' ||result === null){
            alert("Error")
        }
        else{
            $('#newContent').on('click','#editContent',function(){
                let inputs = $('#formModal :input');
                var values = {};
                inputs.each(function() {
                values[this.name] = $(this).val();});
                $.ajax({
                url:'content/'+fired_button,
                method:'PUT',
                contentType:'application/json',
                data:JSON.stringify(values),
                success: function(response){
                    console.log(response);
                    $('#formModal')[0].reset();
                    $('.modal').modal('hide');
                    postDB=response[1];
                    console.log(response[1][0]);
                    setTimeout(function(){
                     addContentWithComment(response[0],response[0].comment);
                    }, 200);
                 }
                });
            });
        };
    });
    //DELETE POST ###############################(success)
    $('#newContent').on('click','#deleteContent',function(){
        let result=new Object();
        let fired_button= $(this).attr("value");
        postDB.forEach(function(event){
            if(Number(event.id)===Number(fired_button)){ 
                result= event;
                return false; 
            }
        });
        if( typeof result === 'undefined' ||result === null){
            alert("Error")
        }
        else{
        $.ajax({
         url:'content/'+result.id,
            method:'DELETE',
            contentType:'application/json',
            success: function(response){
                addContent(response);
               postDB=response;
               addStatus("Post Deleted")
            }
        });
    }
    });
    //###########################################################################################################


    //POST request for post    //###########################################################################################################

    $('#form').on('submit', submitHandler);

    //###########################################################################################################
    // POST COMMENT 
    $('#newContent').on('click','.comment',function(event){
        let fired_button= $(this).attr("value");
        let result=new Object();
        postDB.forEach(function(event){
            if(Number(event.id)===Number(fired_button)){
                
                result= event;
              return false;
               
            }
           
        });
        if( typeof result === 'undefined' ||result === null){
            alert("Error")
        }
      
        else{
            $('#addComment').off('click').on('click', function(){
                event.preventDefault();
                let values=$('#comment').val();
                $.ajax({
                url:'content/'+fired_button+'/comment',
                method:'POST',
                dataType:'json',
                data:{'comment':values,'username':userStatus},
                success: function(response){
                    $('#formModalComment')[0].reset();
                     $('.modal').modal('hide');
                      
                    setTimeout(function(){
                        addContentWithComment(response[0],response[1])
                        
                       }, 200);
                       postDB=response[2];
                 }
                });
            });
        };
    });


    //Delete comment#############################
    $('#newContent').on('click','#deleteComment',function(){
        let result=new Object();
        let commentID= $(this).attr("value");
        let currentID= $('#edit').attr("value");
        postDB.forEach(function(event){
            if(Number(event.id)===Number(currentID)){ 
                result= event;
                return false; 
            }
        });
        if( typeof result === 'undefined' ||result === null){
            alert("Error")
        }
        else{
        let comment
        result.comment.forEach(function(e){
            

            if(Number(e.id)===Number(commentID)){
                console.log(e.id);
             comment=e;
              return false;
            }
        });
        $.ajax({
         url:'content/'+result.id+'/comment/'+comment.id,
            method:'DELETE',
            contentType:'application/json',
            success: function(response){
                postDB=response[1];
                 addContentWithComment(response[0],response[0].comment)
            }
        });
    }
    });
//login post

$('#loginSubmit').on('click',function(event,err){
event.preventDefault();
$.ajax({
    url: '/login',
    type:'POST',
    data: $('#loginForm').serializeArray(),
    success:function(res){
        localStorage.setItem('currentUser',res.username);
        localStorage.setItem('currentToken',res.access_token);
        console.log(localStorage.getItem("currentToken"))
        userStatus=res.username;
        addStatus("Welcome " +userStatus);
        
        if(userStatus==="admin"){
            $('#loginForm')[0].reset();
            $('#loginButton').toggle();
             $('#logoutButton').toggle();
             $('#login').toggle();
             $('#signupButton').toggle();
            }
        else{
        $('#loginForm')[0].reset();
        $('#signupButton').toggle();
        $('#loginButton').toggle();
        $('#logoutButton').toggle();
        $('#login').toggle();
        }
        let user=$('#myPost');
        user.html('');
        user.append('\
        <h3 id="userNav" class="nav-link" href="#">'+userStatus+'</h3>\
    ')
        addContent(postDB);
    },
    error:function(xhr, textStatus, error){
        if(xhr.responseJSON.message==="no such user found"){
           addStatus("No such username found!");
        };
        if(xhr.responseJSON.message==="passwords did not match"){
            addStatus("Wrong password!");
    };
}
});
});
//logout
$('#logoutButton').on('click',function(event,err){
    localStorage.clear();
    $('#signupButton').toggle();
    $('#loginButton').toggle();
    $('#logoutButton').toggle();
    $('#userNav').toggle();
    userStatus="anonymous";
    $.ajax({
        url:'/logout',
        method:'GET',
        contentType:'application/json',
        success:function(response){
            addContent(response);
            }
    });
});

//register

$('#signupSubmit').on('click',function(event,err){
    event.preventDefault();
    let inputs = $('#signupForm :input');
    var values = {};
    inputs.each(function() {
    values[this.name] = $(this).val();
    });
    values["access_token"]=localStorage.getItem("currentToken")
    $.ajax({
        url: '/people',
        type:'POST',
        data:values,
        success:function(res){
            userStatus=res.username;
            addStatus("Welcome " +userStatus);
            $('#signupForm')[0].reset();
            $('#signupButton').toggle();
            $('#loginButton').toggle();
            $('#logoutButton').toggle();
            $('#login').hide();
            $('#signup').hide();
            let user=$('#myPost');
            user.html('');
            user.append('\
            <h3 id="userNav" class="nav-link" href="#">'+userStatus+'</h3>\
        ')
    },
    error:function(xhr, textStatus, error){
        if(xhr.status===403){
        if(xhr.responseJSON.message==="NO!"){
            addStatus("Forbidden");
        }
        }
        else{
        if(xhr.responseJSON.message==="Username taken!"){
            addStatus("Username taken!");
         };
         if(xhr.responseJSON.message==="Email taken!"){
             addStatus("Email taken!");
         }
     };
    }
    });
    });

//function 

//display status of request 
function addStatus(string){
    let status=$('#statusMessage');
    status.html('');
    status.append('\
    <div class="alert alert-warning my-5" role="alert">\
    <p class="mt-3">'+string+'\</p>\
     </div>\
    ');
    $("#statusMessage").show().delay(3000).fadeOut()
    }
    //Post Content Function
    
function submitHandler (e) {    
      e.preventDefault();
    
      $.ajax({
        url: '/content',
        type:'POST',
        data: $('#form').serializeArray(),
        success:function(res){
            addContent(res);
            $('#form')[0].reset();
                postDB=res;   
        }
    });
}
//Check id
function checkID(db,id){
        let result=new Object();
        db.forEach(function(event){
            if(Number(event.id)===Number(id)){
                result= event;
              return false;  
            }
            else{
                result= null;
            }     
        });
        console.log(result)
        return result 
    }

function addContentWithComment(db,comment){
        addFullContent(db);
        let tbodyEL=$('#commentSection');
        tbodyEL.html(''); 
        comment.forEach(function(element){
             if(userStatus==="admin"){
                tbodyEL.append('\
                <p>'+element.comment+'</p>\
                <p id="'+element.username+'" style="font-size:14px;">By: '+element.username+'</p>\
                <button value='+element.id+' type="button"id="deleteComment" class="btn btn-sm btn-warning d-flex ml-auto mr-2 mb-2">Delete</button>\
                ');
            }
        else if(element.username===userStatus && userStatus!=="anonymous"){
            tbodyEL.append('\
            <p>'+element.comment+'</p>\
            <p id="'+element.username+'" style="font-size:14px;">By: '+element.username+'</p>\
            <button value='+element.id+' type="button"id="deleteComment" class="btn btn-sm btn-warning d-flex ml-auto mr-2 mb-2">Delete</button>\
            ');
        }
        else if(element.username!==userStatus || userStatus==="anonymous"){
            tbodyEL.append('\
            <p>'+element.comment+'</p>\
            <p id="'+element.username+'" style="font-size:14px;">By: '+element.username+'</p>\
            ');
        }
       
        });
    }
function addFullContent(e){
        let tbodyEL=$('#newContent');
                tbodyEL.html('');     
                  tbodyEL.append('<div class="col-lg-12 p-4 ">\
                <div class="card  mb-3 h" style="width:80%;margin:auto;">\
                 <img src="'+e.picture+'" class="card-img-top" >\
                 <div class="card-body">\
                     <h3 style="font-size:1em;">Rating: '+e.rating+'</h3>\
                     <h4 class="card-text "style="font-size:1em;">'+e.description+'</h4>\
                     <h6 id="author" style="font-size:1em;">Author: '+e.username+'</h6>\
                     <div id="commentSection">\
                     </div>\
                     <button id="edit" type="button" value="'+e.id+'"class="btn btn-sm btn-primary edit " data-toggle="modal" data-target="#exampleModal" data-whatever="@edit">Edit</button>\
                      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
                         <div class="modal-dialog" role="document">\
                          <div class="modal-content">\
                        <div class="modal-header">\
                        <h5 class="modal-title"  id="exampleModalLabel">Edit Post</h5>\
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                  <span aria-hidden="true">&times;</span>\
                   </button>\
                  </div>\
                 <div class="modal-body">\
                 <form id="formModal">\
                <div class="form-group">\
                    <label for="description" class="col-form-label">New Description:</label>\
                    <textarea placeholder="Description/Story" class="form-control"name="description" id="description"></textarea>\
                  </div>\
                  <div class="form-group">\
                  <label for="rating" class="col-form-label">New Experience Rating:</label>\
                  <input class="form-control"placeholder="Rate Your Experience From 1-10" name="rating" id="rating" min="0" max="10" type="number" required>\
                  </div>\
                  </form>\
              </div>\
              <div class="modal-footer">\
                <button type="button" value="'+e.id+'" class="btn btn-primary"id="editContent">Submit</button>\
                   </div>\
                  </div>\
                  </div>\
                 </div>\
                 <button id="#edit" type="button" value="'+e.id+'"class="btn btn-sm btn-primary comment " data-toggle="modal" data-target="#ModalComment" data-whatever="@edit">Comment</button>\
                      <div class="modal fade" id="ModalComment" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
                         <div class="modal-dialog" role="document">\
                          <div class="modal-content">\
                        <div class="modal-header">\
                        <h5 class="modal-title"  id="exampleModalLabel">Add Comment</h5>\
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                  <span aria-hidden="true">&times;</span>\
                   </button>\
                  </div>\
                  <form id="formModalComment">\
                 <div class="modal-body">\
                <div class="form-group">\
                    <label for="comment" class="col-form-label">New Comment:</label>\
                    <textarea placeholder="Description/Story" class="form-control"name="comment" id="comment"></textarea>\
                  </div>\
              </div>\
              <div class="modal-footer">\
                <button type="button" value="'+e.id+'" class="btn btn-primary"id="addComment">Submit</button>\
                   </div>\
                   </form>\
                  </div>\
                  </div>\
                 </div>\
                     <a   href="#" value="'+e.id+'" class="btn btn-sm btn-danger"id="deleteContent">Delete</a>\
                 </div>\
             </div>\
        </div>\
        '
                  );
         
        if(e.username!==userStatus && userStatus!=="admin"){
            $("#deleteContent").toggle();
            $("#edit").toggle();
        }

    }
    //find element according to specific content
    // add new post function##################
function addContent(response){
        let tbodyEL=$('#newContent');
        tbodyEL.html('');
        response.forEach(function(e){
        tbodyEL.append('<div class="col-lg-12 p-4 ">\
            <div class="card  mb-3 h" style="width:80%;margin:auto;">\
                 <img src="'+e.picture+'" class="card-img-top" >\
                 <div class="card-body">\
                 <h3>'+e.title+'<br><span style="font-size:20px;font-style:bold;">  (Experience Rating: '+e.rating+' )</span></h3>\
                     <h5 ></h5>\
                     <h6 ><i>Author: '+e.username+'</i></h6>\
                     <button  type="button" class="btn btn-info mt-2 btn-md btn-block" id="moreInfo" value="'+e.id+'">More Info</button>\
                    ');
       
     });
    };
function addPeople(response){
        let tbodyEL=$('#newContent');
        tbodyEL.html('');
        tbodyEL.append('\
        <div class="container">\
        <h1 class="text-center display-5 mb-2">Our fantastic author </h1>\
        <h3 class="text-center display-5 mb-5">(Click to see their post) </h3>\
        <ul class="list-group">\
            </ul>\
        </div>\
        ')
        let listGroup=$('.list-group');
            listGroup.html('');
        
        response.forEach(function(e){            
                listGroup.append('\
                <li href="#" class="list-group-item  list-group-item-action text-center display-5 "id="'+e.username+'">'+e.username+'</li>\
            ')
        });
        
    }
function addPeopleContent(userProfile,userPost){
        let tbodyEL=$('#newContent');
        tbodyEL.html('');
        userPost.forEach(function(e){
        tbodyEL.append('<div class="container mb-1"><h3 class="text-center">Post By Author</h3>\
        <h6 class="text-center">Username: '+userProfile.username+'</h6>\
        <h6 class="text-center">Forename: '+userProfile.forename+'</h6>\
        <h6 class="text-center">Surname: '+userProfile.surname+'</h6>\</div>\
        <div class="col-lg-12 p-4 ">\
            <div class="card  mb-3 h" style="width:80%;margin:auto;">\
                 <img src="'+e.picture+'" class="card-img-top" >\
                 <div class="card-body">\
                 <h3>'+e.title+'<br><span style="font-size:20px;font-style:bold;">  (Experience Rating: '+e.rating+' )</span></h3>\
                     <h5 ></h5>\
                     <h6 ><i>Author: '+e.username+'</i></h6>\
                     <button  type="button" class="btn btn-info mt- btn-md btn-block" id="deletePeople" value="'+e.id+'">More Info</button>\
                    ');  
     });
    }
});