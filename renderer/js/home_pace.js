var name2url = {
    "Toán" : "../img/Toan.jpg",
    "Vật lí" : "../img/VatLy.jpg",
    "Hóa học" : "../img/HoaHoc.jpg",
    "Sinh học" : "../img/SinhHoc.jpg",
    "Tin học" : "../img/TinHoc.jpg",
    "GD QP-AN" : "../img/GDCP.jpg",
    "Công nghệ" : "../img/CongNghe.jpg",
    "Ngữ văn" : "../img/Van.jpg",
    "Lịch Sử" : "../img/LinhSu.jpg",
    "Địa Lí" : "../img/DiaLy.jpg",
    "GDCD" : "../img/GDCD.jpg",
    "Thể dục" : "",
    "Ngoại ngữ" : "../img/TienAnh.jpg",
    "Tin học" : "../img/TinHoc.jpg"
}


function createHomePage(data) {
    let html = document.createElement("div")
    html.className = "allsub";

    data.forEach((e) => {
        html.appendChild(create_div_subject(e));
    })

    document.getElementById("body").innerHTML = '';
    document.getElementById("body").appendChild(html);

}

function createrFiterTab() {
    var l = document.querySelector(".main-header .l");
    l.innerHTML = '';

    var button = document.createElement("button");
    button.className = 'bu on';
    button.textContent = "All";
    button.onclick = (j) => {
        document.querySelectorAll(".main-header .bu").forEach(l => {
            l.classList.remove("on");
        })
        j.target.classList.add("on");
        Cookie_all.listRoom.forEach(e => {
            document.querySelector(".allsub").appendChild(create_div_subject(e));
        })
    }

    l.appendChild(button);

    var bu_more = document.createElement("div");
    bu_more.className = "bu more"

    var contenr = document.createElement("div")
    contenr.className = "contenr";

    var ha = []
    Cookie_all.listRoom.forEach((e) => {
        if (!ha.includes(e.TenMon))
        {
            if (ha.length < 3) {

                var button = document.createElement("button");
                button.className = 'bu';
                button.textContent = e.TenMon
                button.onclick = (j) => {
                    document.querySelectorAll(".main-header .bu").forEach(l => {
                        l.classList.remove("on");
                    })
                    j.target.classList.add("on");
                    fiter(e.TenMon)
                }
                l.appendChild(button);
            }
            if (ha.length == 3) {
                var dis = document.createElement("div");
                dis.className = "displa";
                dis.textContent = e.TenMon;
                bu_more.appendChild(dis);

            }
            if (ha.length >= 3) {
                var button = document.createElement("button");
                button.className = 'bu';
                button.textContent = e.TenMon
                button.onclick = () => {
                    document.querySelectorAll(".main-header .bu").forEach(l => {
                        l.classList.remove("on");
                    })


                    document.querySelector(".main-header .bu.more").classList.add("on");
                    document.querySelector(".main-header .bu.more .displa").textContent = e.TenMon;
                    fiter(e.TenMon)

                }

                contenr.appendChild(button);
                
            }
            ha.push(e.TenMon);
        }


    })

    bu_more.appendChild(contenr);
    l.appendChild(bu_more);
    
}

function select() {

}

function fiter(name) {
    document.querySelector(".allsub").innerHTML = ''
    Cookie_all.listRoom.forEach(e => {
        if (e.TenMon == name)
        {
            document.querySelector(".allsub").appendChild(create_div_subject(e));
        }
    })
}
    
function create_div_subject(data) {

    var date = data.NgayDayHienThi;
    date = date.substring(date.indexOf("-") + 2 , date.length - 1)

    var url = name2url[data.TenMon];


    var html = `
        <div class="sta">
            trực tiếp
        </div>
        <div class="img">
            <img src="${url}" alt="">
        </div>
        <div class="div_title">

            <p class="title">
                ${data.TenBaiHoc}
            </p>
        </div>
        <p class="giaovien li">
            ${data.TenGiaoVien}
        </p>
        <p class="date li">
            ${date}
        </p>
        `

    var div = document.createElement('div')
    div.className = 'sub'
    div.innerHTML = html
    div.onclick = (e) => {
        jsroom(data);
    }
    return div
}

function jsroom(data)
{
    Cookie.set("phong" , data)
    window.location.href = document.location.href = document.location.href.replace("home.html", "phonghoc.html");
}
