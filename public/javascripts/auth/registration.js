var NotValidatedFields= [];

$(document).ready(function() {
    $('#sign-up').click( function() {
        var email = GetValidatedDataReg($('#email').val(),'email');
        var login = GetValidatedDataReg($('#login').val(),'login');
        var password = GetValidatedDataReg($('#password').val(),'password');
        var repassword = GetValidatedDataReg($('#repassword').val(),'password');
        var name = GetValidatedDataReg($('#name').val(),'name');
        var contact = GetValidatedDataReg($('#contact').val(),'contact');
        var key_skills = "";
        if($('#html').is(':checked')){key_skills=key_skills+"html "};
        if($('#css').is(':checked')){key_skills=key_skills+"css "};
        if($('#js').is(':checked')){key_skills=key_skills+"JavaScript "};
        var additional_info = $('#about').val();
        dataToRequest = {"login": login,
            "email": email,
            "name": name,
            "contact_number": contact,
            "key_skills": key_skills,
            "additional_info": additional_info,
            "password": password};
        dataToRequest = JSON.stringify(dataToRequest);
        if(NotValidatedFields.length==0 & password==repassword ){SendRequest(dataToRequest);};

    });
});

function GetValidatedDataReg(Data, type) {
    if (Data.length==0){
        return false;
    }
    switch (type) {
        case 'login':
            RegExp =/[a-zA-Z0-9]/;
            break;
        case 'password':
            RegExp =/[a-zA-Z0-9]/;
            break;
        case 'number':
            RegExp =/[0-9]/;
            break;
        default:
            RegExp =/.+/;
    }
    var result = RegExp.test(Data);
    if(result==true){
        return Data;
    }
    else{
        return false;
        NotValidatedFields.add(Data);
    };

}


function SendRequest(Data) {
    console.log(Data)
    $.ajax({
        url: "/sign-up/",
        method: "POST",
        data: Data,
        statusCode: {
            201: function(resp_data) {
                localStorage.setItem("token", resp_data.token);
                location="/index.html";
            },
            400: function() {
                $('#remember').before('<div class="alert alert-danger"> <strong>400!</strong> Validation error </div>');
            },
            409: function() {
                $('#remember').before('<div class="alert alert-danger"> <strong>409!</strong> conflict in DB </div>');
            }

        },
        contentType: "application/json"

    })

};