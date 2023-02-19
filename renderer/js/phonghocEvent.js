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


    // chuyển san tap thí thuyết
    document.querySelector(".starbar .lt.li .svg").addEventListener("click", (e) => {
        document.getElementById("noidungbaihoc").className = "conten";
        var noidungbaihoc = infor.NoiDungBaiHoc;
        noidungbaihoc = noidungbaihoc.replaceAll('src="//', 'src="https://')
        craftBaiHoc(noidungbaihoc);
        document.querySelector(".inline.timer").classList.remove("ac")
    });

    // chuyển san tap bài tập
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

function goto(i) {
    infor['cauhoiIndex'] = i;
    changeCauhoi(i);
    updataListViewCauhoi();
    heightLine();
}

function chatOnOff() {
    if (document.querySelector(".body .chat").classList.contains("active")) {
        document.querySelector(".body .chat").classList.remove("active")
    }
    else {
        document.querySelector(".body .chat").classList.add("active")
    }
}

function menuOnOff() {
    if (document.querySelector(".body .chat").classList.contains("active")) {
        document.querySelector(".body .directional .svg").classList.remove("turn-180")
        document.querySelector(".body .chat").classList.remove("active");
    }
    else {
        document.querySelector(".body .chat").classList.add("active");
        document.querySelector(".body .directional .svg").classList.add("turn-180")
    }
}
