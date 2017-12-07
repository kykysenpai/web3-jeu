$(function(){
    $('#facebookConnect').on('click',function(e){
      console.log("formulaire.js -> onclick facebook");
      window.location = '/auth/facebook';
    });

    $('#facebookShare').on('click',function(e){
        console.log("formulaire.js -> onclick facebook");
      });
});
