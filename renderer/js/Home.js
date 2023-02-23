var _Home_BaiHocGiaoVienID = null;
var _Home_BaiHocID = null;
var _Home_LopID = null;
var _Home_isMobile = false;
var _Home_GetHoTro = '';
var _Ttn_Timer;
var _Htt_Timer;
var _Web_Check_Timer;
var User;
var Loaded = false;
var Slider_Timer;
this.DLL_Login = "Elearning.Core.Login";
var hrefEx = ['#/HSTraCuuDiemThi']
var _isFirstConnectEx = true;
var host_limit = ['tracnghiem22.vietschool.vn', 'tracnghiem.vietschool.vn', 'tracnghiemonline.vn'];

var Home_chophepdangnhap = function () {
    df_UpdateNetStatus(_NetStatus.OK);
    if (_isFirstConnectEx) {
        _isFirstConnectEx = false;
    }
}
var IsLoadLoginForm = false;
var _NetStatus = { OK: "OK", Er: "Error", Wa: "Warming", No: "Nothing" };
var _NetState = _NetStatus.No;
var ChonPhongTab = -1;
var _Home_IsLogonOTP = false;
var _iOriginEvent;
var _iSourceEvent;
var Home_IsInsideIframe = window.location !== window.parent.location;
var Home_doiketnoi = function () {
    if (_isFirstConnectEx) {

    }
    return !_isFirstConnectEx;
}
var Home_IFMenu = "";
var _Home_Focus = true;
var Cookie_all = {};

Cookie.all().then((e) => {
    Cookie_all = e;
    connect(() => {
        GetUserInfor(() => {
            GetListRoom(0);
        });
    })
    document.querySelectorAll(".r div.text-dis").forEach((e) => {
        e.addEventListener('click', () => {
            var pa = e.parentElement;
            if (pa.querySelector('ul').classList.contains("on")){
                pa.querySelector('ul').classList.remove('on')
            }
            else {
                pa.querySelector('ul').classList.add('on')
            }

        })
    })
    document.querySelector(".bu.mor").addEventListener('click' , () => {
        if (document.querySelector('.menu ul').classList.contains("on")) {
            document.querySelector('.menu ul').classList.remove("on")
        }
        else {
            document.querySelector('.menu ul').classList.add("on")
        }
    })

    document.querySelectorAll(".menu .ul ul > li").forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.className)
            switch (e.className)
            {
                case 'l1':
                    break;
                case 'l2':
                    break
                case 'l3':
                    break
                case 'l4':
                    break
                case 'l5':
                    break;
                case 'l6':
                    break
                case 'l7':
                    break
                case 'l8':
                    Cookie.logout().then(() => {
                        document.location.href = document.location.href.replace("home.html", "index.html");
                    })
                    break;
            }
        })
    })

    document.querySelector('.menu .ul .l6').addEventListener('click' , () => {

    })

})

var ShowLoader = {
    On: () => {
        document.getElementById("loader").style.visibility = "visible";
    },

    Off: () => {
        document.getElementById("loader").style.visibility = "hidden";
    }
}

function GetListRoom(loaiPhong) {
    WSGet(function (result) {
        var Data = result.Data.getTable("Data").toJson();
        console.log(Data);
        Cookie_all["listRoom"] = Data;
        createHomePage(Data);
        createrFiterTab()
        ShowLoader.Off();
    }.bind(this), "Elearning.Core.Learning", "GetHSPhongHoc", loaiPhong.toString());
}

function GetUserInfor(callback) {
    WSGet(function (result) {
        var jsonResult = JSON.parse(result.Data);
        if (jsonResult) {
            
            User = jsonResult;
            Cookie.set("user", User);
            document.title = User.name;
        }
        else {
            if (result.ErrorMessage != '') {
                document.location.href = document.location.href.replace("home.html", "index.html");
            }
        }

        if (callback)
            callback(jsonResult);
        //}
    }, "Elearning.Core.Login", "CheckLogged");
}

function GetRoom(roomId) {
    WSGet(function (result) {
        df_HideLoading();
        if (CheckResult(result)) {
            DsPhongHocData = {};
            //xử lý tại đây thành kiểu dữ liệu cây môn->chủ đề -> bài học
            var ISources = [];
            var Data = result.Data.getTable("Data").toJson();
        }
    }.bind(this), "Elearning.Core.Learning", "GetHSPhongHoc", roomId);
}

function SignOut() {
    WSGet(function (result) {
        setCookie('TNTokenID', null, 0);
    }, "Elearning.Core.Login", "Logout");
}

function XuatExcel(theGrid, sheetName, fileName) {
    var exportFormatItem = function (args) {
        let xlsxCell = args.xlsxCell;
        if (xlsxCell.value) {
            xlsxCell.style.font.family = "";
        }
    };
    var wb = wijmo.grid.xlsx.FlexGridXlsxConverter.save(theGrid, { sheetName: sheetName, includeColumnHeaders: true, includeRowHeaders: false, formatItem: exportFormatItem });
    wb.save(fileName + '.xlsx');
}


function GetHoTro() {
    if (_Home_GetHoTro == '')
        WSDBGet(function (r) {
            if (CheckResult(r)) {
                _Home_GetHoTro = '';
                var table = r.Data.getTable('KyThuatHoTro');
                var table1 = r.Data.getTable('DuPhong');
                _Home_GetHoTro = "<p>Vui lòng liên hệ kỹ thuật: </p>";
                if (table.Rows.length > 0)
                    for (var i = 0; i < table.Rows.length; i++) {
                        var item = table.Rows[i];
                        _Home_GetHoTro += '<p style="margin-left:30px"> <i class="fa-solid fa-person-circle-question" aria-hidden="true"></i> <b style="color:blue;">' + item.getCell("TenKyThuat") + '</b> <i style="margin-left:30px" class="fa-solid fa-phone" aria-hidden="true"></i> <b style="color: blue;">' + item.getCell("SDT") + "</b></p>";
                    }
                else
                    if (table1.Rows.length > 0) {
                        for (var i = 0; i < table1.Rows.length; i++) {
                            var item = table1.Rows[i];
                            _Home_GetHoTro += '<p style="margin-left:30px"> <i class="fa-solid fa-person-circle-question" aria-hidden="true"></i> <b style="color:blue;">' + item.getCell("TenKyThuat") + '</b> <i style="margin-left:30px" class="fa-solid fa-phone" aria-hidden="true"></i> <b style="color: blue;">' + item.getCell("SDT") + "</b></p>";
                        }
                    }
                    else {
                        _Home_GetHoTro = "Hiện chưa có kỹ thuật hỗ trợ.";
                    }
                showMsg('Thông tin liên hệ', _Home_GetHoTro, "Đồng ý", 'success', e => { return; });
            }
        }, "HS.Home.GetHoTro", "SchoolID", User.SchoolID);
    else
        showMsg('Thông tin liên hệ', _Home_GetHoTro, "Đồng ý", 'success', e => { return; });
}

function df_UpdateNetStatus(NStatus) {
    if (_NetState != NStatus && !(_NetState == _NetStatus.Er && NStatus == _NetStatus.Wa)) {
        _NetState = NStatus;
        if (NStatus == _NetStatus.OK) {
            // df_FlashControl('_netspan', false);
        }
        else if (NStatus == _NetStatus.Er) {
            // df_FlashControl('_netspan', true);
        }
        else if (NStatus == _NetStatus.Wa) {
            // df_FlashControl('_netspan', true);
        }
    }
}

function DoiMatKhau() {
    WSGet(function (e) {
        df_HideLoading();
        if (CheckResult(e)) {
            showMsg('Thông báo', "Cập nhật thông tin thành công", undefined, 'success');
            $('#mdDoiMatKhau').modal("hide");
            $('#txt_MKCu').val('');
            $('#txt_MatKhau_HideMoi1').val('');
            $('#txt_MatKhau_HideMoi2').val('');
        }
    }, 'Elearning.Core.Login', "Save_ThongTin_CaNhan", "HS", pass, mkCu);
}
