//gestion de la redirection automatique vers la bonne page selon si un cookie est present à l'affichage de la page index

$(function(){
    $('#loading').on('click',function(e){
        console.log("welcome.js -> on clic accueil");
        $.ajax({
          url:'/verifyLoggedIn',
          type:'GET',
          data:{
            token : localStorage.getItem("token")
          },
          success:function(response){
            //localsession found
            console.log("Session active "+localStorage.getItem("authName") + "   " + localStorage.getItem("token"));
            /*$("deconnexion").show();
            $("deconnexion").css("display","block");
            $("#accueil").hide();
            $("#choix").show();
          */
          },
          error:function(response){
            //localsession not found
            console.log("No active session");
            /*$("#accueil").hide();
            $("#formulaires").show();*/            
          }
        });
      });
});