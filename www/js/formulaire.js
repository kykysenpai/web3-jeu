$(function(){
    $('#seConnecter').on('click',function(e){
        console.log("SeConnecter");

        var login = $('#pseudoConnexion').val();
        var mdp = $('#mdpConnexion').val();
        console.log("login : "+ login);        
        console.log("mdp : "+ mdp);
        /*
        var res = db.players.find({
          "login": login,
          "mdp": mdp
        });
        */

        $.ajax({
          url:'/seConnecter',
          type:'POST',
          dataType: "json",
          data:{
            login:$('#pseudoConnexion').val(),
            mdp:$('#mdpConnexion').val()
          },
          sucess:function(data,textStatus){
            
            console.log('sucess ' + data);
          },
          error:function(textStatus,errorThrown){
            console.log("textStatus" + textStatus);
            throw errorThrown;
          }

          
        });
      });

});
