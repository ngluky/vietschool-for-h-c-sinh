var ws;
var __inroom;
var __inited;
var __client_lost_counter = 0;
var __client_hienthongbao = false;

//var url = "wss://192.168.1.241:4985/vs";
var urls =
    [
        "wss://tracnghiem1.vietschool.vn:4989/vs",
        "wss://tracnghiem2.vietschool.vn:4989/vs",
        "wss://tracnghiem3.vietschool.vn:4989/vs",
        "wss://tracnghiem4.vietschool.vn:4989/vs"
    ]

var isIOS = (function () {
    var iosQuirkPresent = function () {
        var audio = new Audio();

        audio.volume = 0.5;
        return audio.volume === 1;   // volume cannot be changed from "1" on iOS 12 and below
    };

    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    var isAppleDevice = navigator.userAgent.includes('Macintosh');
    var isTouchScreen = navigator.maxTouchPoints >= 1;   // true for iOS 13 (and hopefully beyond)

    return isIOS || (isAppleDevice && (isTouchScreen || iosQuirkPresent()));
})();

if (isIOS) {
    urls =
        [
            "wss://tracnghiem1.vietschool.vn:4987"           
        ]
}

if (location.hostname == 'localhost') {
    urls = ['ws://localhost:4985/vs'];
    urls = ["wss://tracnghiem4.vietschool.vn:4989/vs"];
    //urls = ['ws://localhost:4985/vs']
    /* urls = ["wss://tracnghiem3.vietschool.vn:4985/vs"]*/
    //urls = ["ws://localhost:4985/api/WS"]
    //urls = ["wss://tracnghiem4.vietschool.vn:4987"]
}

function getRandomInt(max) {
    var n;
    for (var i = 0; i < 20; i++)
        n = Math.floor(Math.random() * max);
    return n;
}

//if (window.location.host == 'localhost:10382' || window.location.host == 'localhost:10383' || window.location.host == 'localhost:2605')
//    url = "wss://" + window.location.host + "/api/WS";
//else
//if (window.location.host == 'manghocsinh.vn')
//    url = "wss://" + window.location.host + "/api/WS";
//else
//url = "wss://tracnghiem.vietschool.vn/api/WS";


function connect(callback) {
    ws = new ProSocket({ urls: urls, token: null });
    ws.onopen = () => {
        callback();
        __lastSocketOK = true;
        console.log("Socket was opened");
        if (__inroom)   
            Rejoin();
        __inited = true;
        WSGet.apply(null, __arg);
        __arg = undefined;
    };
    ws.onmessage = function (msg) {
    };
    ws.onerror = function (evt) {
        console.log('Connect fail!');
        df_UpdateNetStatus(_NetStatus.Wa);
        __client_lost_counter++;
        if (__client_lost_counter >= 10 && __client_hienthongbao == false) {
            __client_hienthongbao = true;
            df_HideLoading();
            df_UpdateNetStatus(_NetStatus.Er);
            // showConfirm('Cảnh báo đường truyền', '<p style="color:red;"> Không thể kết nối đến hệ thống server, vui lòng tạm dừng thao tác, kiểm tra đường truyền mạng hoặc thử tải lại trang vài lần nếu không được hãy liên hệ giáo viên.<p>', 'Chấp nhận tải lại trang', 'Bỏ qua, chấp nhận rủi ro',
            //     function () { __client_lost_counter = 0; location.reload(); },
            //     function () { __client_lost_counter = 0; __client_hienthongbao = false });
        }
    };
    ws.onclose = function () {
        __showSocketClosed();
        __lastSocketOK = false;
    };
    ws.registerOnMessageFunction(this, socketMessage);
}
function socketMessage(msg) {
    if (msg && msg.startsWith && msg.startsWith("Tài khoản của bạn vừa đăng nhập ở một thiết bị khác!")) {
        setCookie('TNTokenID', null, 0);
        alert(msg);
        //window.location.href = '/';
        window.location.reload();
    }
}

var __arg;
function socketOpen() {
    // GetUserInfor();
    // GetListRoom(0);
    
}

function connectAutoParam() {
    __arg = arguments;
}

function ConvertFCL2ID(fullClassName) {
    if (fullClassName.indexOf("Elearning.Core.") >= 0) return 1001;
    else return -1;
}


function CheckResult(result, showDiv) {
    if (result.ErrorNumber == 0) { return true; }
    else {
        var errMess = result.ErrorMessage.replace("\\r\\n", "</br>");
        if (errMess == 'Timeout') {
            errMess = 'Yêu cầu quá thời gian thực thi, Vui lòng thao tác lại.';
            df_HideLoading();// đóng loading khi timeout
        }
        else {

        }
        const indexOfFirst = errMess.indexOf(':');
        errMess = errMess.substring(indexOfFirst + 1);
        if (showDiv) { $('#' + showDiv).text(errMess); }
        else showMsg('Thông báo lỗi', errMess, 'Chấp nhận', 'error', function () { return; });
        return false;
    }
}

var __lastSocketOK = false;
function WSGet() {
    if (arguments.length > 0) {
        if (!__inited)
            connectAutoParam.apply(null, arguments);
        else {
            if (ws.readyState == WebSocket.OPEN) {
                __lastSocketOK = true;
                var TNTokenID = Cookie_all["TNTokenID"];
                //var TNTokenID = ws.token;
                //WSGet(function (callback1, DLL, "SaveBaiHoc", SchoolID, BaiHocID, TenBaiHoc, NoiDungBaiHoc, KhoiID, MonID);   --Mine
                //ws.get(callback1, route, token, class, function, para1, para2, ...);      --Their
                var fixArguments = [arguments[0], ConvertFCL2ID(arguments[1]), TNTokenID, arguments[1], arguments[2]];
                for (var i = 3; i < arguments.length; i++)
                    fixArguments.push(arguments[i]);
                ws.get.apply(ws, fixArguments);
            }
            else {
                if (__lastSocketOK) {
                    __showSocketClosed();
                }
                __lastSocketOK = false;
            }
        }
    }
}

//callback, functionName, field1, value1, field2, value2, ...
function WSDBGet() {
    //console.log(arguments);
    if (arguments.length > 0) {
        if (!__inited)
            connectAutoParam.apply(null, arguments);
        else {
            if (ws.readyState == WebSocket.OPEN) {
                __lastSocketOK = true;
                var TNTokenID = Token;
                //var TNTokenID = ws.token;
                //WSGet(function (callback1, DLL, "SaveBaiHoc", SchoolID, BaiHocID, TenBaiHoc, NoiDungBaiHoc, KhoiID, MonID);   --Mine
                //ws.get(callback1, route, token, class, function, para1, para2, ...);      --Their
                var fixArguments = [arguments[0], 1001, TNTokenID, '', arguments[1]];
                var tb = new DataTable();
                tb.Columns.add('Field', 'String');
                tb.Columns.add('Value', 'String');
                for (var i = 2; i < arguments.length; i++)
                    tb.Rows.add(arguments[i], arguments[++i]);
                fixArguments.push(tb);
                ws.get.apply(ws, fixArguments);
            }
            else {
                if (__lastSocketOK) {
                    __showSocketClosed();
                }
                __lastSocketOK = false;
            }
        }
    }
}

var __bootbox;
function __showSocketClosed() {
    //if (__lastSocketOK)
    //    __bootbox = bootbox.alert('Mất kết nối với máy chủ');
}

function __showSocketOpened() {
    Home_chophepdangnhap();
}

function Rejoin(callback) {
    WSGet(function (result) {

    }, "Elearning.Core.RoomManager", "RejoinRoom");
};

