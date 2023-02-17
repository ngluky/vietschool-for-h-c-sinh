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
    l.innerHTML = ''

    var button_all = document.createElement("button")
    button_all.className = "on";
    button_all.textContent = "All"
    button_all.onclick = () => {
        createHomePage(Cookie_all.listRoom)
    }

    l.appendChild(button_all)

    var have = []
    Cookie_all.listRoom.forEach(e => {
        if (have.length >= 3) {
            return;
        } 
        if (!have.includes(e.TenMon)) {
            var button = document.createElement("button")
            button.textContent = e.TenMon;
            button.onclick = () => {
                fiter(e.TenMon)
            }
            
            have.push(e.TenMon)
            l.appendChild(button)
        }
    })

    var button_show = document.createElement('button')
    button_show.className = "add"
    
    l.appendChild(button_show)
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



`<div class="allsub">
<div class="sub">
    <div class="hd">
        <h3 class="tt">
            LT Phương pháp tọa độ trong không gian 2
        </h3>
        <p>Toán</p>
    </div>
    <div class="bd">
        <div class="l_bd">
            <li>Thời Gian làm bài</li>
            <li>Loại Phòng</li>
            <li>Giáo Viên</li>
            <li>Bài tập</li>
            <li>Cho xem bài</li>

        </div>
        <div class="r_bd">
            <li>10s</li>
            <li>Ôn Tập</li>
            <li>Giáo Viên</li>
            <li>Bài tập</li>
            <li>Cho xem bài</li>
        </div>
    </div>
    <div class="end">
        <p>21:00 18/02</p>
    </div>
</div>
</div>`