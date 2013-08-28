$(document).ready(function(){
    $("#mediaOne").click(function(){
        var toAdd = $('input[name=checkListItem]').val(); 
        console.log("");
    });
    
    $(document).on('click', '.list', function() {
        $(this).remove();
    });
});