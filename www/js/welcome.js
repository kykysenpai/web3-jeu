//gestion de la redirection automatique vers la bonne page selon si un cookie est present à l'affichage de la page index

$(function(){
    $('#loading').on('click',function(e){
        console.log("welcome.js -> on clic auto");
        $.ajax({
          url:'/verifyLoggedIn',
          type:'GET',
          dataType: "json",
          data:{},
          success:function(response){
            //localsession found
            console.log("session " + response.status);
            $("#accueil").hide();
            $("#choix").show();
            $("#authName").html(localStorage.getItem("authName"));
          },
          error:function(response){
            //localsession not found
            console.log("no session " + response.status);
            $("#accueil").hide();
            $("#formulaires").show();            
          }
        });
      });
});