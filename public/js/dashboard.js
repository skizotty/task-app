$('.card-profile-stats-more-link').click(function(e){
    e.preventDefault();
    if ( $(".card-profile-stats-more-content").is(':hidden') ) {
      $('.card-profile-stats-more-link').find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
    } else {
      $('.card-profile-stats-more-link').find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
    }
    $(this).next('.card-profile-stats-more-content').slideToggle();
  });
function createHideTaskFormFunction() {
  function hideAddTaskForm() {
    console.log('hiding form')
    $("[class=add-task-form]").hide(500);
  }
  var hidingButton = document.getElementById('hide-new-task')
  hidingButton.addEventListener('click',hideAddTaskForm)
}


function addTaskFormReveal() {
    $(".add-task-form").show(500);
    createHideTaskFormFunction()
}

var addTaskButton = document.querySelector('[id=add-task]')
addTaskButton.addEventListener('click',addTaskFormReveal)


