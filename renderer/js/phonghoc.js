
var infor = {};
var index2s = ["A", "B", "C", "D"];
var Unit = {1: "Kb",2: "Mb",3: "Gb",4: "Tb"}
var tab_file = []
var Cookie_all = {};
var saveID = 0;
dtSave = new DataTable();
dtSave.Columns.add('ID_Save', 'String');
dtSave.Columns.add('CauHoiID', 'String');
dtSave.Columns.add('NoiDungBaiLam', 'String');
dtSave.Columns.add('STTDapAn', 'String')


function df_bin2String(array) {
    return String.fromCharCode.apply(String, array);
}

function tracNhiemInit() {
    infor["cauhoiIndex"] = 1;
    craftCauhoi(infor.cauhoiIndex);
}

function heightLine() {
    document.querySelectorAll(`.body .ctl .da`).forEach((e) => {
        e.classList.remove("select");
    })
    var index = infor["cauhoiIndex"]
    for (var i = 0; i < infor.arr_Bailam.length; i++) {
        var cau = infor.arr_Bailam[i];
        if (cau.cau == index) {
            if (!document.querySelector(`.body .ctl .da.${cau.dapan.toLowerCase()}`).classList.contains("select"))
                document.querySelector(`.body .ctl .da.${cau.dapan.toLowerCase()}`).classList.add("select")
        }
    }
}

function joinRoom() {
    WSGet(function (rs1) {
        console.log(rs1)
    }, 'Elearning.Core.LearningRoom', 'ElearningCheckRoom', infor.BaiHocGiaoVienID.toString(), (df_unnu(Cookie_all.phong.BaiHocLopID) ? "" : Cookie_all.phong.BaiHocLopID.toString()), (infor.LaKiemTra ? "1" : "0"), Cookie_all.phong.TrangThaiID.toString(), df_DateTime_SQL(new Date));
}

function GetBaiHoc(phongId , callback) {
    WSGet((r) => {
        var data = r.Data.getTable("BaiHoc").toJson()[0];
        infor = data;
        infor["arr_Bailam"] = [];
        console.log(data);
        document.getElementById("tenbai").textContent = data.TenBaiHoc;
        document.getElementById("mon").textContent = data.TenMon;
        var noidungbaihoc = data.NoiDungBaiHoc;
        noidungbaihoc = noidungbaihoc.replaceAll('src="//', 'src="https://')
        var element = document.createElement('div')
        element.innerHTML = noidungbaihoc;

        element.querySelectorAll("p a").forEach(e => {
            var url = e.href;
            var name_file = e.textContent;
            name_file = name_file.replaceAll('-', ' ').replaceAll('_', ' ')
            arr_url = url.split("/")
            var AccessCode = arr_url[arr_url.length - 1]
            var FileId = arr_url[arr_url.length - 2]

            var html = `
                <button class="file" onclick="viewFile('${url}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    <div >
                        <p class="name">
                            ${name_file}
                        </p>
                        <p class="size" id="${FileId}">
                            ____
                        </p>
                    </div>
                </button>
                `

            e.parentElement.innerHTML = html;
            
            WSDBGet((re) => {
                var data = re.Data.getTable('Table').toJson()[0];
                document.getElementById(data['FileID']).innerHTML = filesize(data.FileSize);
                infor.NoiDungBaiHoc = document.querySelector("#noidungbaihoc .noidungbaihoc").innerHTML

            } ,"HS.GetFileInfo","FileID", FileId ,"AccessCode", AccessCode)
        })

        infor.NoiDungBaiHoc = element.innerHTML;
        if (callback) callback(r);
        craftBaiHoc(infor.NoiDungBaiHoc)


    }, "Elearning.Core.LearningRoom", "ElearningInit", phongId.toString(), "0")



}

function GetBaiTap() {
    WSGet((result) => {
        // console.log(r.Data);

        infor.arr_HoanVi = result.Data.getTable('HoanVi').toJson();
        var arr_DapAn = result.Data.getTable("DapAn").toJson();
        var arr_DapAn_CauHoiID = convertJson2Array(arr_DapAn, 'CauHoiID');
        var arr_Cauhoi_temp = result.Data.getTable('CauHoi').toJson();
        var arr_Cauhoi = [];
        for (var ch = 0; ch < arr_Cauhoi_temp.length; ch++) {
            var value = arr_Cauhoi_temp[ch];
            var item = {};
            item.SoDapAn = value.SoDapAn;
            item['cauhoiid'] = value.CauHoiID;
            item['cauhoi'] = value.NoiDungCauHoi;
            item['doanvan'] = value.DoanVanID;
            item['dapan'] = [];

            item['tracnghiem'] = value.TracNghiem;
            if (value.TracNghiem) {
                var pos = arr_DapAn_CauHoiID.indexOf(item['cauhoiid']);
                if (pos == -1) {
                    arr_Cauhoi = [];
                }
                var arr_HoanViID = convertJson2Array(infor.arr_HoanVi, 'HoanViID');
                var poshv = arr_HoanViID.indexOf(value.HoanViID);
                var arr_HoanVi_CH = [];
                if (poshv != -1) {
                    for (var i = 0; i < 4; i++) {
                        arr_HoanVi_CH.push(infor.arr_HoanVi[poshv + i]);
                    }
                }

                var arr_DapAn_Temp = [];
                for (var i = pos; i < pos + item.SoDapAn; i++) {
                    if (arr_DapAn_CauHoiID[i] == item['cauhoiid'])
                        arr_DapAn_Temp.push(arr_DapAn[i]);
                }

                if (arr_HoanVi_CH.length >= item.SoDapAn && arr_DapAn_Temp.length == item.SoDapAn) {
                    for (var j = 0; j < arr_HoanVi_CH.length; j++) {
                        for (var i = 0; i < arr_DapAn_Temp.length; i++) {
                            if (arr_DapAn_Temp[i].STTDapAn == arr_HoanVi_CH[j].STTDapAn) {
                                item['dapan'].push({ 'stt': j, 'noidung': arr_DapAn_Temp[i].NoiDung });
                            }
                        }
                    }
                }
            }
            item['hoanvi'] = value.HoanViID;
            arr_Cauhoi.push(item);
        }

        infor.arr_Data = arr_Cauhoi;
        var arr_Bailam_temp = result.Data.getTable('BaiLam').toJson();
        arr_Bailam_temp.forEach((e) => {

            var value = arr_Cauhoi[e.cau - 1]; // má nó chứ thiếu mỡi số 1
            var dapan = tranSTTtoString(value, e.dapan);
            var item = {
                "cau": e.cau,
                "dapan": dapan,
                "xemlai": 0,
                "isdaluu": true,
            }
            infor.arr_Bailam.push(item);
        })


        if (infor.SoPhutLamBai) {
            infor["minute_left"] = infor.SoPhutLamBai;
        }
        tracNhiemInit();
        craftListViewCauhoi()
        updataListViewCauhoi()

    }, "Elearning.Core.LearningRoom", "ElearningInitCauHoi_Upgade",
        Cookie_all.phong.BaiHocGiaoVienID.toString(),
        Cookie_all.phong.BaiHocLopID.toString(), "0")
}

function tranSTTtoString(now_cauhoi, dapan) {
    var arr_HoanViID = convertJson2Array(infor.arr_HoanVi, 'HoanViID');
    var poshv = arr_HoanViID.indexOf(now_cauhoi.hoanvi);
    var arr_HoanVi_CH = [];
    if (poshv != -1) {
        for (var i = 0; i < 4; i++) {
            arr_HoanVi_CH.push(infor.arr_HoanVi[poshv + i]);
        }
    }

    var arr_HoanViID_fill = convertJson2Array(arr_HoanVi_CH, 'STTDapAn');
    var pos1 = arr_HoanViID_fill.indexOf(dapan);
    if (pos1 != -1) {
        dapan = arr_HoanVi_CH[pos1]['STT'];
    }

    if (dapan == 0)
        dapan = 'A';
    else if (dapan == 1)
        dapan = 'B';
    else if (dapan == 2)
        dapan = 'C';
    else
        dapan = 'D';
    return dapan;
}

function xemlai(index) {
    if (!index) {
        index = infor.cauhoiIndex
    }
    var pos = undefined;
    for (var i = 0; i < infor.arr_Bailam.length; i++) {
        if (infor.arr_Bailam[i].cau == index) {
            pos = i;
            var value = infor.arr_Bailam[pos];
            value.xemlai = 1;
            infor.arr_Bailam[pos] = value;
            updataListViewCauhoi();
            return;
        }
    }

    var item = {
        "cau": index,
        "dapan": undefined,
        "xemlai": 1,
        "isdaluu": false,
    }
    infor.arr_Bailam.push(item);
    updataListViewCauhoi();
}

function updataBaiLam(cau, dapan) {
    if (!cau) {
        cau = infor.cauhoiIndex;
    }
    console.log(`update ${cau} at ${dapan}`);

    var cauhoi = infor.arr_Data[cau - 1];

    var r = dtSave.select(function (r) { return r.getCell("CauHoiID") == cauhoi.cauhoiid.toString() });
    var stt = dapan;
    if (infor.ChoHoanVi) {
        if (cauhoi.hoanvi && cauhoi.hoanvi != 0) {
            var arr_HoanViID = convertJson2Array(infor.arr_HoanVi, 'HoanViID');
            var pos = arr_HoanViID.indexOf(cauhoi.hoanvi);
            if (pos != -1) {
                var arr_HoanVi_CH = [];
                for (var i = 0; i < 4; i++) {
                    arr_HoanVi_CH.push(infor.arr_HoanVi[pos + i]);
                }
                var arr_HoanViID_fill = convertJson2Array(arr_HoanVi_CH, 'STT');
                var pos1 = arr_HoanViID_fill.indexOf(parseInt(stt));
                if (pos1 != -1) {
                    stt = arr_HoanVi_CH[pos1]['STTDapAn'].toString();
                }
            }
        }
    }

    if (r.length === 0) {
        dtSave.Rows.add(0, cauhoi.cauhoiid.toString(), null, stt);
    }
    else {
        r[0].setCell('STTDapAn', stt);
        r[0].setCell('NoiDungBaiLam', null);
    }



    for (var i = 0; i < infor.arr_Bailam.length; i++) {
        if (infor.arr_Bailam[i].cau == cau) {
            var value = infor.arr_Bailam[i];
            value.dapan = index2s[dapan];
            return true;
        }
    }

    var item = {
        "cau": cau,
        "dapan": index2s[dapan],
        "xemlai": 0,
        "isdaluu": false,
    }
    infor.arr_Bailam.push(item);
}

function outRoom() {
    WSGet((rs) => {
        console.log(rs);
        Cookie.set("phongid", null);
        window.location.href = document.location.href = document.location.href.replace("phonghoc.html", "home.html");
    }, "Elearning.Core.RoomManager", "OutRoom", Cookie_all.phong.BaiHocGiaoVienID.toString());

}

function next() {
    infor["cauhoiIndex"]++;

    if (infor["cauhoiIndex"] > infor.arr_Data.length) {
        infor["cauhoiIndex"] = 1;
    }
    changeCauhoi(infor["cauhoiIndex"]);
    heightLine()
    updataListViewCauhoi()

}

function back() {
    infor["cauhoiIndex"]--;
    if (infor["cauhoiIndex"] == 0) {
        infor["cauhoiIndex"] = infor.arr_Data.length;
    }
    changeCauhoi(infor["cauhoiIndex"]);
    heightLine()
    updataListViewCauhoi()
}


function changeCauhoi(index) {
    var cauhoi = infor.arr_Data[index - 1];
    if (!cauhoi) return;
    document.querySelector(".main_cauhoi .stt").textContent = "Câu " + index.toString() + ":";
    document.querySelector(".main_cauhoi .cauhoi .noidung").innerHTML = cauhoi.cauhoi;
    document.querySelector(".main_cauhoi .ctl .a .noidung").innerHTML = cauhoi.dapan[0].noidung;
    document.querySelector(".main_cauhoi .ctl .b .noidung").innerHTML = cauhoi.dapan[1].noidung;
    document.querySelector(".main_cauhoi .ctl .c .noidung").innerHTML = cauhoi.dapan[2].noidung;
    document.querySelector(".main_cauhoi .ctl .d .noidung").innerHTML = cauhoi.dapan[3].noidung;
}

function convertStringToHtml(str) {
    var div = document.createElement("div");
    div.innerHTML = str;
    return div.children[0];
}

function updataListViewCauhoi() {
    infor.arr_Bailam.forEach((e) => {
        document.querySelector(".chat .tag_conten .list-content").children[e.cau - 1].children[2].textContent = e.dapan;
        if (e.xemlai &&
            !document.querySelector(".chat .tag_conten .list-content").children[e.cau - 1].classList.contains("warning")) {
            document.querySelector(".chat .tag_conten .list-content").children[e.cau - 1].classList.add("warning")
        }
    })
    var index = infor.cauhoiIndex;
    document.querySelectorAll(".chat .tag_conten .list-content .li").forEach(e => e.classList.remove("now"))

    document.querySelector(".chat .tag_conten .list-content").children[index - 1].classList.add("now")
}

function craftListViewCauhoi() {
    for (var i = 1; i <= infor.arr_Data.length; i++) {
        var str = `
        <button class="li" onclick="goto('${i}')">
            <p>${i}</p>
            <div></div>
            <p></p>
        </button>`
        document.querySelector(".chat .tag_conten .list-content").appendChild(convertStringToHtml(str));
    }
}

function filesize(bytes) {
    var len_str = bytes.toString().length;
    var unit_val = Math.trunc(len_str / 3);
    var convet_val = bytes / 2 ** (10 * unit_val)
    return `${convet_val.toFixed(2)}${Unit[unit_val]}`
}

function craftBaiHoc(str) {
    document.getElementById("noidungbaihoc").innerHTML = `
    <div class="noidungbaihoc">
                    ${str}
                </div>
                <div class="chat">
                    <div class="conten">
                        <div class="tag_header">
                            <div class="li active">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <span>chat</span>
                            </div>
                            <div class="li">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span>Online</span>
                            </div>
                        </div>
                        <div class="tag_conten">
                            <div class="chat_content active">
                                <div class="mess">
                                    <div class="list_mess"></div>
                                </div>
                                <div class="input">
                                    <input type="text" class="mess_input" id="text_mess">
                                    <button onclick="Send()">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    </button>
                                </div>
                            </div>

                            <div class="online">

                            </div>
                        </div>
                    </div>
                    <button class="button_chat" onclick="chatOnOff()">

                    </button>
                </div>
    `

    

}

function craftCauhoi(index) {
    var cauhoi = infor.arr_Data[index - 1];
    if (!cauhoi) return;
    var html = `
            <div class="main_cauhoi">

                <div class="cauhoi">
                    <span class="stt">Câu ${index}:</span>
                    <span class="noidung">
                    ${cauhoi.cauhoi}
                    </span>
                </div>
                <div class="ctl">
                    <div class="a da">

                        <div class="svg">
                            A
                        </div>

                        <div class="noidung">
                            ${cauhoi.dapan[0].noidung}
                        </div>
                    </div>
                    <div class="b da">
                        <div class="svg">
                            B
                        </div>

                        <div class="noidung">
                            ${cauhoi.dapan[1].noidung}
                        </div>
                    </div>
                    <div class="c da">
                        <div class="svg">
                            C
                        </div>

                        <div class="noidung">
                            ${cauhoi.dapan[2].noidung}
                        </div>
                    </div>
                    <div class="d da">
                        <div class="svg">
                            D
                        </div>

                        <div class="noidung">
                            ${cauhoi.dapan[3].noidung}
                        </div>
                    </div>
                    <!-- </div> -->
                </div>
                <div class="directional">
                    <div class="bwn">
                        <button class="back it" onclick="back()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <polyline points="11 17 6 12 11 7"></polyline>
                                <polyline points="18 17 13 12 18 7"></polyline>
                            </svg>
                        </button>
                        <button class="watc it" onclick="xemlai()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </button>
                        <button class="next it" onclick="next()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <polyline points="13 17 18 12 13 7"></polyline>
                                <polyline points="6 17 11 12 6 7"></polyline>
                            </svg>
                        </button>
                    </div>

                    <div class="menu">
                    <div class="menu">
                        <button class="svg" onclick="menuOnOff()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 18 11 12 17 6"></polyline><path d="M7 6v12"></path></svg>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            
            <div class="chat">
            <div class="conten">
            <div class="tag_header">
                <div class="li active">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z">
                        </path>
                        <path d="m9 12 2 2 4-4"></path>
                    </svg>
                    <span>câu hỏi</span>
                </div>
                <div class="li">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>chat</span>
                </div>
                <div class="li">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>Online</span>
                </div>
            </div>
            <div class="tag_conten">
                <div class="listcau active">
                    <div class="list">
                        <div class="list-content">
                        </div>
                    </div>
                    <div class="button">
                        <button class="button_nop butt-ch">Nộp bài</button>
                        <div class="button_menu butt-ch">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="12" cy="5" r="1"></circle>
                                <circle cx="12" cy="19" r="1"></circle>
                            </svg>
                            <input type="text">
                        
                            <div class="con"> 
                                <div class="li">
                                    <p>copy</p>
                                </div>
                                
                                <div class="li">
                                    <p>pass</p>
                                </div>
                                
                                <div class="li">
                                    <p>Làm lại</p>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

                <div class="chat">

                </div>

                <div class="online">

                </div>
            </div>
        </div>
                </div>
            `

    document.getElementById('noidungbaihoc').innerHTML = html;

    document.querySelector(".body .ctl .da.a").addEventListener("click", () => {
        updataBaiLam(undefined, 0);
        heightLine()
        updataListViewCauhoi()

    });

    document.querySelector(".body .ctl .da.b").addEventListener("click", () => {
        updataBaiLam(undefined, 1);
        heightLine()
        updataListViewCauhoi()

    });

    document.querySelector(".body .ctl .da.c").addEventListener("click", () => {
        updataBaiLam(undefined, 2);
        heightLine()
        updataListViewCauhoi()
    });

    document.querySelector(".body .ctl .da.d").addEventListener("click", () => {
        updataBaiLam(undefined, 3);
        heightLine()
        updataListViewCauhoi()
    });

    heightLine()

}

function convertJson2Array(dataj, fi) {
    var arr;
    if (fi)
        arr = Object.keys(dataj).map(function (k) { return dataj[k][fi] });
    else
        arr = Object.keys(dataj).map(function (k) { return k });
    return arr;
}

function viewFile(url) 
{
    arr_url = url.split("/")
    var AccessCode = arr_url[arr_url.length - 1]
    var FileId = arr_url[arr_url.length - 2]
    if (tab_file.includes(FileId)) return;
    var div_file = document.createElement("div")
    div_file.className = `file li fileid${FileId}`
    div_file.innerHTML = `
        <dir class="svg active">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <line x1="10" y1="9" x2="8" y2="9"></line>
                </svg>
            </dir>
        <p>file</p>
    `


    div_file.addEventListener('click', () => {
        document.getElementById("noidungbaihoc").innerHTML = `
        <div class="view_file">
            <iframe
            src="https://docs.google.com/gview?url=${url}&embedded=true"
            frameborder="0"></iframe>

            <a class="button_dow" href="${url}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </a>
        </div>`
    })

    document.querySelectorAll(".starbar .svg").forEach((e) => {
        e.classList.remove("active");
    });

    document.querySelector(".main .starbar").appendChild(div_file);
    tab_file.push(FileId)
    document.getElementById("noidungbaihoc").innerHTML = `
        <div class="view_file">
            <iframe
            src="https://docs.google.com/gview?url=${url}&embedded=true"
            frameborder="0"></iframe>

            <a class="button_dow" href="${url}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </a>
        </div>`
    document.querySelectorAll(".starbar .svg").forEach((e) => {
        e.addEventListener("click", (e) => {
            var target = e.target;
            while (!(target.localName == "dir")) {
                target = target.parentElement;
            }
            document.querySelectorAll(".starbar .svg").forEach((e) => {
                e.classList.remove("active");
            });
            target.classList.add("active")

        })
    });
    
}

function saveCau() 
{
    
}

function df_unnu(obj) {
    return (typeof obj === 'undefined') || obj == null;
}

function df_DateTime_SQL(d) {
    return d.getFullYear() + "-" + df_addZero(d.getMonth() + 1) + "-" + df_addZero(d.getDate()) + " " + df_addZero(d.getHours()) + ":" + df_addZero(d.getMinutes()) + ":" + df_addZero(d.getSeconds());
}

function df_addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}