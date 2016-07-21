var chekbox = $('#remember').is(':checked');

$(document).ready(function() {
    $('#sign-in').click( function(){
        if(login !=false & password!=false){
            SendRequest();
            ;}
        else{
            $('#remember').before('<div class="alert alert-danger"> Some fields are incorrect </div>');
        }
    })
});

function GetValidatedData(Data) {
    admin='admin';
    if (Data.length==0){
        return false;
    }
    var RegExp =/[a-zA-Z0-9]/;
    var result = RegExp.test(Data);
    if(result==true){
        return Data;
    }
    else{
        return false;
    };
}

function SendRequest()  {
    var login = GetValidatedData($('#login').val());
    var password = GetValidatedData($('#password').val());
    if(login !=false & password!=false) {
        $.ajax({
            url: "/sign-in/",
            method: "POST",
            data: { login: login, password: password },
            statusCode: {
                200: function(data) {
                    if (chekbox){localStorage.setItem("token", data.token);} else {sessionStorage.setItem("token", data.token);};
                    location="/index.html";
                },
                400: function() {
                    $('#remember').before('<div class="alert alert-danger"> <strong>400!</strong> No such user </div>');
                },
                401: function() {
                    $('#remember').before('<div class="alert alert-danger"> <strong>401!</strong> Wrong password </div>');
                }

            }

        })
    }
}