$(function(){
    $('#seConnecter').on('click',function(e){
        console.log("formulaire.js -> on clic SeConnecter");
        var login = $('#pseudoConnexion').val();
        var mdp = $('#mdpConnexion').val();
        console.log("formulaire.js -> on clic value login : "+ login);        
        console.log("formulaire.js -> on clic value mdp "+ mdp);
        
        $.ajax({
          url:'/seConnecter',
          type:'POST',
          dataType: "json",
          data:{
            login:$('#pseudoConnexion').val(),
            mdp:$('#mdpConnexion').val()
          },
          success:function(response){
            console.log("success " + response.status);
          },
          error:function(response){
            console.log("success " + response.status);
          }
        });
      });


      $('#sInscrire').on('click',function(e){
        console.log("formulaire.js -> on clic Sinscrire");
        var login = $('#pseudoConnexion').val();
        var mdp = $('#mdpConnexion').val();
        console.log("formulaire.js -> on clic value login : " + login);        
        console.log("formulaire.js -> on clic value mdp : "+ mdp);
        
        $.ajax({
          url:'/sInscrire',
          type:'POST',
          dataType: "json",
          data:{
            login:$('#pseudoInscription').val(),
            mdp:$('#mdpInscription').val()
          },
          success:function(response){
            console.log("success " + response.status);
          },
          error:function(response){
            console.log("success " + response.status);
          }          
        });
      });
});
