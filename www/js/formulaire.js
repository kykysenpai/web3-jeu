//gestion des connexions et inscriptions de la div formulaires

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
            console.log("success " + response.body.status + "   " + response.body.authName + "   " + response.body.token);
            //localStorage.setItem("authName", response.body.authName);
            //localStorage.setItem("token", response.body.token);
            $("#formulaires").hide();
            $("#choix").show();
            //$("#authName").html(localStorage.getItem("authName"));
          },
          error:function(response){
            console.log("error " + response.body);
            $("#messageInscription").html("<p>La connexion a échoué.</>");
            $("#messageInscription").css("color:red");
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
            $("#messageLogin").html("<p>L'inscription a été prise en compte!</>");
            $("#messageLogin").css("color:green");
          },
          error:function(response){
            console.log("success " + response.status);
            $("#messageLogin").html("<p>L'inscription a échoué</>");
            $("#messageLogin").css("color:red");
          }          
        });
      });
});
