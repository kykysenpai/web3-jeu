//gestion des connexions et inscriptions de la div formulaires

$(function(){
    $('#seConnecter').on('click',function(e){
        var loginConnexion = $('#pseudoConnexion').val();
        var mdp = $('#mdpConnexion').val();
        console.log("formulaire.js -> on clic value login : "+ login + " mdp "+ mdp);        
        
        $.ajax({
          url:'/seConnecter',
          type:'POST',
          dataType: "json",
          data:{
            login:loginConnexion,
            passwd:mdp
          },
          success:function(response){
            localStorage.setItem("authName", response.authName);
            localStorage.setItem("token", response.token);
            console.log("Contenu localStorage : " 
            + localStorage.getItem("authName") + "   " + localStorage.getItem("token"));
            $("#messages").append("<p class='alert-success'>Vous êtes connecté!</p>").fadeIn("fast").fadeOut("slow");
            /*$("#deconnexion").show();
            $("#formulaires").hide();
            $("#choix").show();
          */
          },
          error:function(response){
            console.log("Connexion error " + response.status + " message : " + response.err);
            $("#messages").append("<p class='alert-danger'>La connexion a échoué.</p>").fadeIn("fast").fadeOut("slow");;
          }
        });
      });

      $('#sInscrire').on('click',function(e){
        var loginInscription = $('#pseudoInscription').val();
        var mdp = $('#mdpInscription').val();
          $.ajax({
            url:'/sInscrire',
            type:'POST',
            dataType: "json",
            data:{
              login: loginInscription,
              passwd: mdp
            },
          success:function(response){
            console.log("success " + response.status + " " + response.message);
            $("#messages").append("<p class='alert-success'>L'inscription a été prise en compte.</p>").fadeIn("fast").fadeOut("slow");
          },
          error:function(response){
            console.log("error " + response.status + " " + response.message);
            $("#messages").append("<p class='alert-danger'>L'inscription a échoué.</p>").fadeIn("fast").fadeOut("slow");
          }          
        });
      });
});
