var time_cou = null

Cookie.all().then((d) => {
    Cookie_all = d;

    connect(() => {
        GetBaiHoc(Cookie_all.phong.BaiHocGiaoVienID , () => {
            if (!Cookie_all.incognito_mode) joinRoom();
        });
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


    // chuyển san tab lý thuyết
    document.querySelector(".starbar .lt.li .svg").addEventListener("click", (e) => {
        document.getElementById("noidungbaihoc").className = "conten";
        var noidungbaihoc = data_tracnhiem.NoiDungBaiHoc;
        noidungbaihoc = noidungbaihoc.replaceAll('src="//', 'src="https://')
        craftBaiHoc(noidungbaihoc);
        clearInterval(time_cou)
    });
    
    // chuyển san tap bài tập
    document.querySelector(".starbar .bt.li .svg").addEventListener("click", (e) => {
        if (!Cookie_all.incognito_mode){

            time_cou = setInterval(() => {
                data_tracnhiem.second_Bailam++;

                var deta = data_tracnhiem.second_lemit - data_tracnhiem.second_Bailam;
                document.getElementById("timer_cout").textContent = formatTime(deta);

                var phantram = 100 - ((deta/data_tracnhiem.second_lemit) * 100)
                document.getElementById("progress-bar").style.transform = `translateX(-${phantram}%)`

                var r = (phantram/100) * 130 + 76;
                var g = (phantram/100) * (-59) + 144;
                var b = (phantram/100) * (-92) + 97;

                document.getElementById("progress-bar").style.background = `rgb(${r} , ${g} , ${b})`


            } , 1000)
        }
        if (!data_tracnhiem.arr_Data) {
            GetBaiTap();
        }
        else {

            document.getElementById("noidungbaihoc").className = "main_cauhoi";
            document.getElementById("noidungbaihoc").innerHTML = '';
            craftCauhoi(data_tracnhiem.cauhoiIndex)
            // console.log('ok')
            craftListViewCauhoi()
            
        }

    });

})

function formatTime(sec_num) {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours != 0) {
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+"g " + minutes + "p " + seconds + "s"
    };

    if (minutes != 0){
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return minutes + "p " + seconds + "s"
    }
    return seconds + "s"
}

function goto(i) {
    data_tracnhiem['cauhoiIndex'] = i;
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
