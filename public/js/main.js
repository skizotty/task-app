
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
  });