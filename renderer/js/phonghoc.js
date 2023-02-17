
var infor = {};
var index2s = [
    "A", "B", "C", "D"
];
var Cookie_all = {};

Cookie.all().then((d) => {
    Cookie_all = d;

    connect(() => {
        GetBaiHoc(Cookie_all.phong.BaiHocGiaoVienID);
    });
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

    document.querySelector(".starbar .lt.li .svg").addEventListener("click", (e) => {
        document.getElementById("noidungbaihoc").className = "conten";
        var noidungbaihoc = infor.NoiDungBaiHoc;
        noidungbaihoc = noidungbaihoc.replaceAll('src="//', 'src="https://')
        craftBaiHoc(noidungbaihoc);
        document.querySelector(".inline.timer").classList.remove("ac")
    });

    document.querySelector(".starbar .bt.li .svg").addEventListener("click", (e) => {
        if (!infor.arr_Data) {
            GetBaiTap();
        }
        document.getElementById("noidungbaihoc").className = "main_cauhoi";
        document.getElementById("noidungbaihoc").innerHTML = '';
        document.querySelector(".inline.timer").classList.add("ac")
        craftCauhoi(infor.cauhoiIndex)
        craftListViewCauhoi()

    });

})

function tracNhiemInit() {
    infor["cauhoiIndex"] = 1;
    craftCauhoi(infor.cauhoiIndex);
}

function chatOnOff() {
    if (document.querySelector(".body .chat").classList.contains("active")) {
        document.querySelector(".body .chat").classList.remove("active")
    }
    else {
        document.querySelector(".body .chat").classList.add("active")

    }
}

function heightLine() {
    document.querySelectorAll(`.body .ctl .da`).forEach((e) => {
        e.classList.remove("select");
    })
    var index = infor["cauhoiIndex"]
    for (var i = 0; i < infor.arr_Bailam.length; i++) {
        if (infor.arr_Bailam[i].cau == index) {
            var cau = infor.arr_Bailam[i];

            if (!document.querySelector(`.body .ctl .da.${cau.dapan.toLowerCase()}`).classList.contains("select"))
                document.querySelector(`.body .ctl .da.${cau.dapan.toLowerCase()}`).classList.add("select")
        }
    }
}

function GetBaiHoc(phongId) {
    WSGet((r) => {
        var data = r.Data.getTable("BaiHoc").toJson()[0];
        infor = data;
        infor["arr_Bailam"] = [];
        console.log(data);
        document.getElementById("tenbai").textContent = data.TenBaiHoc;
        document.getElementById("mon").textContent = data.TenMon;
        var noidungbaihoc = data.NoiDungBaiHoc;
        noidungbaihoc = noidungbaihoc.replaceAll('src="//', 'src="https://')
        document.querySelector("#noidungbaihoc .noidungbaihoc").innerHTML = noidungbaihoc;
    }, "Elearning.Core.LearningRoom", "ElearningInit", phongId.toString(), "0"
    )

}

function xemlai(index) {
    var pos = undefined;
    for (var i = 0; i < infor.arr_Bailam.length; i++) {
        if (infor.arr_Bailam[i].cau == index) {
            pos = i;
            break;
        }
    }

    var value = infor.arr_Bailam[pos];
    value.xemlai = 1;
    infor.arr_Bailam[pos] = value;
}

function updataBaiLam(cau, dapan) {
    if (!cau) {
        cau = infor.cauhoiIndex;
    }
    console.log(`update ${cau} at ${dapan}`);

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

function GetBaiTap(data) {
    WSGet((result) => {
        // console.log(r.Data);

        infor.arr_HoanVi = result.Data.getTable('HoanVi').toJson();
        var arr_DapAn = result.Data.getTable("DapAn").toJson();
        var arr_DapAn_CauHoiID = convertJson2Array(arr_DapAn, 'CauHoiID');
        var arr_Cauhoi_temp = result.Data.getTable('CauHoi').toJson();
        var arr_Cauhoi = [];
        for (var ch = 0; ch < arr_Cauhoi_temp.length; ch++) 
        {
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
        infor.arr_Bailam = result.Data.getTable('BaiLam').toJson();

        if (infor.SoPhutLamBai)
        {
            infor["minute_left"] = infor.SoPhutLamBai;
        }
        tracNhiemInit();
        craftListViewCauhoi()
        updataListViewCauhoi()

    }, "Elearning.Core.LearningRoom", "ElearningInitCauHoi_Upgade",
        Cookie_all.phong.BaiHocGiaoVienID.toString(),
        Cookie_all.phong.BaiHocLopID.toString(), "0")
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

function menuOnOff() {
    if (document.querySelector(".body .chat").classList.contains("active")) {
        document.querySelector(".body .chat").classList.remove("active");
    }
    else {
        document.querySelector(".body .chat").classList.add("active");
    }
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
        <button class="li" onclick="
            infor['cauhoiIndex'] = ${i};
            changeCauhoi(${i});
            updataListViewCauhoi();">
            <p>${i}</p>
            <div></div>
            <p></p>
        </button>`
        document.querySelector(".chat .tag_conten .list-content").appendChild(convertStringToHtml(str));
    }
}

function craftBaiHoc(str)
{
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
                        <div class="watc it">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
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
                        <button class="svg" onclick="menuOnOff()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="12" cy="5" r="1"></circle>
                                <circle cx="12" cy="19" r="1"></circle>
                            </svg>
                        </button>
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
                        <button class="button_nop">Nộp bài</button>
                        <button class="button_menu">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                        <div class="element">
                                        <div class="pad">    
                                        <li>Làm lại</li>
                                        <li>Làm lại bài mới</li>
                                        <li>coppy</li>
                                        <li>pass</li>
                                    </div>
                                        </div>
                                    </button>
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