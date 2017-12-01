//gestion de la redirection automatique vers la bonne page selon si un cookie est present à l'affichage de la page index

$(function(){
    $('#loading').on('click',function(e){
        console.log("welcome.js -> on clic accueil");
        $.ajax({
          url:'/verifyLoggedIn',
          type:'GET',
          data:{
            tokenLocal : localStorage.getItem("token"),
            tokenSession : sessionStorage.getItem("token")
          },
          success:function(response){
            console.log("Session localStorage active "+localStorage.getItem("authName") + "   " 
              + localStorage.getItem("token"));
            console.log("Session sessionStorage active "+sessionStorage.getItem("authName") + "   " 
              + sessionStorage.getItem("token"));
            /*$("deconnexion").show();
            $("deconnexion").css("display","block");
            $("#accueil").hide();
            $("#choix").show();
          */
          },
          error:function(response){
            localStorage.removeItem("authName");
            localStorage.removeItem("token");
            sessionStorage.removeItem("authName");
            sessionStorage.removeItem("token");
            console.log("No active session");
            /*$("#accueil").hide();
            $("#formulaires").show();*/            
          }
        });
      });
});