
// Clear Checkbox
$(document).ready(function () {

    function clearFilterCheckbox() {
       var filter_clear = $('.filter-clear');
       filter_clear.on('click',function () {
           $('input:checkbox').removeAttr('checked');
       });
   }
    clearFilterCheckbox();

    // $('input:checkbox').attr('checked', true); // Checks it
    // $('input:checkbox').attr('checked', false); // Unchecks it
});