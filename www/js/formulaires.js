//gestion des connexions et inscriptions de la div formulaires

$(function(){
    $('#seConnecter').on('click',function(e){
        var loginConnexion = $('#pseudoConnexion').val();
        var mdp = $('#mdpConnexion').val();        
        
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
            $("#bestScorePacman").text(response.bestScorePacman + " ");
            $("#bestScoreGhost").text(response.bestScoreGhost + " ");
            $("#nbPlayedGames").text(response.nbPlayedGames + " ");
            $("#nbVictory").text(response.nbVictory + " ");
            $("#nbDefeat").text(response.nbDefeat + " ");
            $(".skinCurrentPacman").append("<img alt=\"default\" src=\"images/"+ response.currentPacman +"\" class=\"col-1 img-rounded img-responsive skins-gallery\"/>");
            $(".skinCurrentGhost").append("<img alt=\"default\" src=\"images/"+ response.currentGhost +"\" class=\"col-1 img-rounded img-responsive skins-gallery\"/>");
            response.pacmanSkins.forEach(function(element){
              $(".skinsPacman").append("<img alt=\"default\" src=\"images/"+element+"\" class=\"col-1 img-rounded img-responsive skins-gallery\"/>");
            });
            response.ghostSkins.forEach(function(element){
              $(".skinsGhost").append("<img alt=\"default\" src=\"images/"+element+"\" class=\"col-1 img-rounded img-responsive skins-gallery\"/>");
            });
            $("#messages").append("<p class='alert-success'>" + response.message + "</p>").fadeIn("fast").fadeOut("slow");
            /*$("#deconnexion").show();
            $("#formulaires").hide();
            $("#choix").show();
          */
          },
          error:function(response){
            console.log(response.responseJSON.err);
            $("#messages").append("<p class='alert-danger'>"+ response.responseJSON.err+"</p>").fadeIn("fast").fadeOut("slow");;
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
            console.log(response.message);
            $("#messages").append("<p class='alert-success'>"+ response.message + "</p>").fadeIn("fast").fadeOut("slow");
          },
          error:function(response){
            console.log(response.responseJSON.err);
            $("#messages").append("<p class='alert-danger'>" + response.responseJSON.err + "</p>").fadeIn("fast").fadeOut("slow");
          }          
        });
      });
});
