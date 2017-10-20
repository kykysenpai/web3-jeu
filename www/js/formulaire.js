$(function(){
    $('#seConnecter').on('click',function(e){
        console.log("SeConnecter");
        var login = document.getElementById('pseudoInscription');
        var mdp = document.getElementById('mdpConnexion');

        //var login = $('#pseudoConnexion').val();
        //var mdp = $('#mdpConnexion').val();

        /*
        var res = db.players.find({
          "login": login,
          "mdp": mdp
        });
        */

        $.ajax({
          url:"/tonurl",
          type:"POST",
          data:"",
          sucess:function(data,textStatus,jqXHR){
            console.log('sucess ' + data);
          },
          error:function(jqXHR,textStatus,errorThrown){
            console.log(textStatus);
            throw errorThrown;
          }

          
        });
      });

});
