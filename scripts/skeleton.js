//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton(){
    console.log($('#navbarPlaceholder').load('./text/nav.html'));
    console.log($('#footerPlaceholder').load('./text/footer.html'));
}
loadSkeleton();  //invoke the function

/*
jQuery is a library with functions to make it easier to use JavaScript.
$()- selects an element by "id" value

jQuery Ajax(Asynchronous javascript and XML)

a) is a library with functions to let us interact with files on the server.
b)the load() is a powerful AJAX function to load(read) data from a text file
that is sitting on the SERVER and puts the data into the selected element. 
*/
 