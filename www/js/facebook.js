$(function(){ 
  $('#facebookConnect').on('click',function(e){ 
    console.log("formulaire.js -> onclick facebook"); 
    var shareUrl = 'http://localhost:5000/auth/facebookConnect'; 
    window.open(shareUrl,"CONNEXION",'height=640,width=550'); 
  }); 

  $('#facebookInsert').on('click',function(e){ 
    console.log("formulaire.js -> onclick facebook"); 
    var shareUrl = 'http://localhost:5000/auth/facebookInsert'; 
    window.open(shareUrl,"CONNEXION",'height=640,width=550'); 
  }); 

  $('#facebookShare').on('click',function(e){ 
    console.log("FACEBOOK SHARE"); 
    var url = this.getAttribute('data-url'); 
    var shareUrl = "https://facebook.com/sharer/sharer.php?u="+encodeURIComponent(url); 
    window.open(shareUrl,"PARTAGE",'height=200,width=150'); 
  }); 
   

});