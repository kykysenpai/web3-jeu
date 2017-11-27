$(function(){
    $('#profil').on('click',function(e){
        console.log("disconnect.js -> on clic deconnexion");
        console.log("Contenu avant effacement : " 
            + localStorage.getItem("authName") + "   " + localStorage.getItem("token"));
        /*$.ajax({
          url:'/deconnecter',
          type:'GET',
          data:{
            token : localStorage.getItem("token")
          },
          success:function(response){
              localStorage.removeItem("authName");
              localStorage.removeItem("token");
              console.log("Contenu après effacement : " 
                      + localStorage.getItem("authName") + "   " + localStorage.getItem("token"));
            /*$("#deconnexion").hide();
            $("#accueil").hide();
            $("#choix").hide();
            $("#formulaires").show();
            $("#jeu").hide();
          },
          error:function(response){
            $("#erreurs").append("<p class='error'>La déconnexion n'a pas fonctionné.</p>").fadeIn("fast").fadeOut("slow");;            
          }
        });*/
      });
});