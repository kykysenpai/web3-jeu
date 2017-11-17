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
            localStorage.setItem("authName", response.authName);
            localStorage.setItem("token", response.token);
            console.log("Contenu localStorage : " 
            + localStorage.getItem("authName") + "   " + localStorage.getItem("token"));
            /*$("#deconnexion").show();
            $("#formulaires").hide();
            $("#choix").show();
          */
          },
          error:function(response){
            console.log("Connexion error " + response.status);
            $("#messages").append("<p class='error'>La connexion a échoué.</>").fadeIn("fast").fadeOut("slow");;
          }
        });
      });

      $('#sInscrire').on('click',function(e){
        var login = $('#pseudoConnexion').val();
        var mdp = $('#mdpConnexion').val();
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
            $("#messages").append("<p class='success'>L'inscription a été prise en compte.</>");
          },
          error:function(response){
            console.log("success " + response.status);
            $("#messages").append("<p class='success'>L'inscription a échoué.</>").fadeIn("fast").fadeOut("slow");
          }          
        });
      });
});
