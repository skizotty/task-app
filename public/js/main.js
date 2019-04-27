
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
        alert("Passwords do not match. Please try again.");
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


