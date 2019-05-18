
$( document ).ready(function() {
	smoothScroll(300);
});


function smoothScroll (duration) {
	$('a[href^="#"]').on('click', function(event) {
	    var target = $( $(this).attr('href') );

	    if( target.length ) {
	        event.preventDefault();
	        $('html, body').animate({
	            scrollTop: target.offset().top
	        }, duration);
	    }
	});
}
function validateMyForm(){
    var passWordConfirmField = document.getElementById('password_conf').value
    var passWordField = document.getElementById('password').value
    var form = document.querySelector('#register-form')
    if(passWordField != passWordConfirmField){ 
        toastr.error("Passwords do not match. Please try again.","Error");
      } else {
          form.submit()
      }
}

function goToRegisterForm() {
    $("#login-form").hide(500);
    $("#register-form").show(500);
    identifyRegisterForm();
}

function goToLoginForm() {
    $("#register-form").hide(500);
    $("#login-form").show(500);
}

function identifyRegisterForm() {
    var switchToLogin = document.querySelector('#switch-to-login');
    switchToLogin.addEventListener('click',goToLoginForm)
}

function hideThenShow(show,hide){
    console.table(show + hide)
    if(typeof hide != 'undefined'){
        $(hide).hide(500);
        $(show).show(500);
    }else {
        $(show).show(500);
    }
}



 $(document).ready(function(){
    function removeTaskFromView(task_id){
        $('#'+task_id).hide(500);
    }
    function deleteTask(task_id){
        fetch(document.location.protocol+'//'+document.location.host+'/deletetask/'+task_id)
        .then(function(response) {
           return response.json();
        })
        .then(function(myJson) {
           console.log(myJson);
           if(myJson.success){
               removeTaskFromView(task_id)
           }else {
               deleteTask(task_id)
           }
        });
     } 
     function startDeleteTask(e){
        e.preventDefault()
        var task_id = this.getAttribute('data-task-id')
        console.log(task_id)
        deleteTask(task_id)
     }
     var buttons = document.querySelectorAll('.delete')
     buttons.forEach(function(button){
        console.log('added')
        button.addEventListener('click',startDeleteTask)
     })

     function changeTaskButton(task_id) {
         //todo change complete button to complete state
     }
     function completeTask(taskId) {
        // url: http://localhost:5000/completetask/5ce026c38445a63d949ea987
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": document.location.protocol+'//'+document.location.host+'/completetask/'+taskId,
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Basic Og==",
                "Accept": "*/*",
                "Cache-Control": "no-cache",
                "Postman-Token": "dcb8ee7a-2631-4f34-9dc5-2fadd11e1e97,0d917fce-3350-4c27-912b-e8555aea00c8",
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": "{    \"lenderRef\": {        \"lenderId\": \"ZU10n75oioem2o9_8nu8j\"    },    \"fields\": [        \"closeDateSatisfaction\",        \"closingCostsSatisfaction\",        \"content\",        \"dateOfService\",        \"details\",        \"interestRateSatisfaction\",        \"loanPurpose\",        \"loanProgram\",        \"loanType\",        \"rating\",        \"serviceProvided\",        \"title\",        \"zipCode\",        \"companyReviewee\",        \"created\",        \"individualReviewee\",        \"response\",        \"reviewerName\",        \"verifiedReviewer\",        \"reviewId\",        \"updated\",        \"location\"    ],    \"pageSize\": 100,    \"page\": 1}"
          }
          
          $.ajax(settings).done(function (response) {
            console.log(response)
            if(response.success){
                changeTaskButton(taskId)
            }else {
                completeTask(taskId)
            }
         });
          
     }
    function startCompleteTask(e){
        e.preventDefault()
        var task_id = this.getAttribute('data-task-id')
        console.log(task_id)
        completeTask(task_id)
        this.disabled = true;
        this.innerText = 'This Task is Complete'
    }
    var completeButtons = document.querySelectorAll('.complete')
    completeButtons.forEach(function(button){
        console.log('added')
        button.addEventListener('click',startCompleteTask)
    })
  });