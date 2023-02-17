




function login(){

    if (!document.getElementById('button_login').innerHTML.includes("Login")) return ;

    var name = document.getElementById('username').value
    var password = document.getElementById('pass').value

    if (name == ''){
        setErr("Tên đăng nhập trống");
    }
    else if (password == ''){
        setErr("mật khẩu trống");
    }
    else {
        
        setErr("");
        loaderOn();
        Service.call((result) => {
            
            if (result.Error != '') {
                setErr(result.Error);
            }
            else 
            {
                let data = result.Data;
                console.log(result); 
                if (data instanceof DataTable){
                    if (data.Columns.exist('ID_Parent')){
                        alert("cảm ơn đã thử dùng ứng dụng, do sự hạn chế bở quền hạn nê tôi(con) chỉ tối ưu hóa cho học sinh mà thôi")
                    }

                }
                else {
                    if (data.Error != undefined){
                        setError(data.Error);
                        return ;
                    }
                    else if (data.get('location') != undefined)
                    {
                        getTNTokenID(data.get('location') , (e) => {console.log(e)})
                    }
                    else if (data.get('Error') != undefined)
                    {
                        setErr(data.get('Error'));
                    }
                    else {
                        setErr("lỗi ngại lệ");
                    }
                }
                


            }

        } , 'Elearning.Core.Login' , 'VietSchoolCheckLogin' , name , password , '', '', '2');
    }   
}

function loaderOn(){
    document.getElementById('button_login').innerHTML = '<div class="loader"></div>'

}

function loaderOff(){
    document.getElementById('button_login').innerHTML = 'Login'
}


function setErr(mess)
{
    document.getElementById('err').innerHTML = mess;
}

function getTNTokenID(url , fun)
{
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'text',
        success: function(result){
            // console.log(result);
            Cookie.set('LoginOTP' , 1);
            let line = result.split('\n');
            line.forEach(element => {
                if (element.includes("var sessionid")){
                    var sessionid = element.split('=')[1].replaceAll("'" , "");
                    sessionid = sessionid.trim()
                    sessionid = sessionid.replace(";" , "");
                    console.log(sessionid);
                    Cookie.set('Net_SessionId' ,sessionid);
                }
                else if (element.includes("var token"))
                {
                    var token = element.split('=')[1].replaceAll("'" , "");
                    token = token.trim()
                    token = token.replace(";" , "");
                    console.log(token);
                    Cookie.set('TNTokenID' , token)
                }
                else if (element.includes("var error")){
                    var error = element.split('=')[1].replaceAll("'" , "");
                    error = error.substr(1 , error.length - 2);
                    loaderOff();
                    setErr(error);
                    return;
                }
            });


            loaderOff();

            // connect();
            // document.location.href
            Cookie.set('remember' , true)
            document.location.href = document.location.href.replace("index.html", "home.html");

        },

        error: function(error) {
            loaderOff();
            setErr("lỗi lấy Token");
        }



    })
}