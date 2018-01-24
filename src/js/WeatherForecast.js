document.addEventListener('DOMContentLoaded',function(){
    var local=document.querySelector('.local');
    var data_weather=document.querySelector("#data_weather");
    var wd=document.querySelector(".wd");
    var gm=document.querySelector(".gm");
    var sCity=document.querySelector("#sCity");
    var btn=document.querySelector("#btn");
    var data_hotCity=document.querySelector("#data_hotCity");
    var data_firstLetter=document.querySelector("#data_firstLetter");
    var data_allCity=document.querySelector("#data_allCity");
    var toTop=document.querySelector("#toTop");

    var arr_status=[200,304];
    var weather_xhr;
    // 获取当前IP -> 获取当前城市 -> 获取本地天气
    var pro_ip=new Promise((resolve,reject)=>{
        // 获取ip（接口）: "../api/getIp.php"
        var ip_xhr=new XMLHttpRequest();
        ip_xhr.onload=function(){
            if(arr_status.includes(ip_xhr.status)){
                var ip=ip_xhr.responseText;
                resolve(ip);
            }
        }
        ip_xhr.open('get','../api/getIp.php',true);
        ip_xhr.send();
        return pro_ip;
    }).then(ip=>{
        var pro_city=new Promise((resolve,reject)=>{
            // 获取city（接口）: "../api/getCity.php"
            var city_xhr=new XMLHttpRequest();
            city_xhr.onload=function(){
                if(arr_status.indexOf(city_xhr.status)>=0){
                    var city=city_xhr.responseText;
                    local.innerText=city;
                    sCity.value=city;
                    resolve(city);
                }
            }
            city_xhr.open('get','../api/getCity.php',true);
            city_xhr.send();
        })
        return pro_city;
    }).then(city=>{
        // 获取weather（接口）: "http://wthrcdn.etouch.cn/weather_mini?city="
        weather_xhr=new XMLHttpRequest();
        weather_xhr.onload=function(){
            if(arr_status.indexOf(weather_xhr.status)!=-1){
                var res=JSON.parse(weather_xhr.responseText).data;
                var weather=res.forecast;
                var ganmao=res.ganmao;
                var wendu=res.wendu;
                wd.innerText=wendu;
                gm.innerText=ganmao;
                var ul=document.createElement('ul');
                ul.innerHTML=weather.map(item=>{
                    var type=item.type;
                    var tianqi;
                    switch(type){
                        case "霾" :
                            tianqi="wu";break;
                        case "暴雪" :
                            tianqi="baoxue";break;
                        case "暴雨" :
                            tianqi="baoyu";break;
                        case "大暴雨" :
                            tianqi="dabaoyu";break;
                        case "大雪" :
                            tianqi="daxue";break;
                        case "大雨" :
                            tianqi="dayu";break;
                        case "多云" :
                            tianqi="duoyun";break;
                        case "雷阵雨" :
                            tianqi="leizhenyu";break;
                        case "晴" :
                            tianqi="qing";break;
                        case "沙尘暴" :
                            tianqi="shachenbao";break;
                        case "雾" :
                            tianqi="wu";break;
                        case "小雪" :
                            tianqi="xiaoxue";break;
                        case "小雨" :
                            tianqi="xiaoyu";break;
                        case "阴" :
                                tianqi="yin";break;
                        case "雨夹雪" :
                            tianqi="yujiaxue";break;
                        case "阵雪" :
                            tianqi="zhenxue";break;
                        case "阵雨" :
                            tianqi="zhenyu";break;
                        case "中雪" :
                            tianqi="zhongxue";break;
                        case "中雨" :
                            tianqi="zhongyu";break;

                        case "冻雨" :
                            tianqi="dongyu";break;
                        case "浮尘" :
                            tianqi="fuchen";break;
                        case "雷阵雨伴有冰雹" :
                            tianqi="leizhenyubanbingbao";break;
                        case "强沙尘暴" :
                            tianqi="qiangshachenbao";break;
                        case "特大暴雨" :
                            tianqi="tedabaoyu";break;
                        case "扬沙" :
                            tianqi="yangsha";break;
                        default:
                            break;
                    }
                    return `<li>
                        <h4>${item.date}</h4>
                        <p>${item.type}</p>
                        <i class="${tianqi}"></i>
                        <p> <span>${item.low.substr(3)}</span> ~ <span>${item.high.substr(3)}</span> </p>
                        <p>${item.fengxiang}</p>
                    </li>`
                }).join('');
                data_weather.innerHTML='';
                data_weather.appendChild(ul);
            }
        }
        weather_xhr.open('get','http://wthrcdn.etouch.cn/weather_mini?city='+city,true);
        weather_xhr.send();
    })

    function outWeather(city){
        local.innerText=city;
        weather_xhr.open('get','http://wthrcdn.etouch.cn/weather_mini?city='+city,true);
        weather_xhr.send();
    }
    // 输入框搜索城市查询天气
    btn.onclick=function(){
        var _city=sCity.value;
        outWeather(_city);
    }

    // 加载城市列表（接口）："../api/data/region.json"
    function showCityList(){
        var cityList_xhr=new XMLHttpRequest();
        cityList_xhr.onreadystatechange=function(){
            if(cityList_xhr.readyState===4 && arr_status.includes(cityList_xhr.status)){
                var res=JSON.parse(cityList_xhr.responseText).regions;

                // 热门城市
                var hot_ul=document.createElement('ul');
                var html='';
                for(var i=0;i<res.length;i++){
                    if(res[i].hot){
                        html+=`<li>${res[i].name}</li>`;
                    }
                    if(res[i].regions){
                        for(var j=0;j<res[i].regions.length;j++){
                            if(res[i].regions[j].hot){
                                html+=`<li>${res[i].regions[j].name}</li>`;
                            }
                        } 
                    }
                }
                hot_ul.innerHTML=html;
                data_hotCity.appendChild(hot_ul);
                // 点击热门城市查询天气
                hot_ul.onclick=function(e){
                    if(e.target.tagName.toLowerCase()==="li"){
                        var _city=e.target.innerText;
                        outWeather(_city);
                    }
                }

                // 生成检索首字母
                var arr_index=[];
                for(var i=0;i<res.length;i++){
                    if (res[i].municipality){
                        var index=res[i].pinyin[0];
                        if(!arr_index.includes(index)){
                            arr_index.push(index);
                        }
                    }else{
                        if(res[i].regions){
                            for(var j=0;j<res[i].regions.length;j++){
                                var index=res[i].regions[j].pinyin[0];
                                if(!arr_index.includes(index)){
                                    arr_index.push(index);
                                }
                            }
                        }
                    }
                }
                arr_index=arr_index.sort();
                var index_ul=document.createElement('ul');
                index_ul.innerHTML=arr_index.map(items=>{
                    return `<li><a href="#${items}">${items}</a></li>`
                }).join('');
                data_firstLetter.appendChild(index_ul);

                // 所有城市
                for(var k=0;k<arr_index.length;k++){
                    var data_ul=document.createElement('ul');
                    var html=`<li id="${arr_index[k]}"><b>${arr_index[k]}</b></li>`;
                    for(var i=0;i<res.length;i++){
                        if(res[i].municipality){
                            if(res[i].pinyin[0]==arr_index[k]){
                                html+=`<li class="city">${res[i].name}</li>`
                            }
                        }else{
                            if(res[i].regions){
                                for(var j=0;j<res[i].regions.length;j++){
                                    if(res[i].regions[j].pinyin[0]==arr_index[k]){
                                        html+=`<li class="city">${res[i].regions[j].name}</li>`
                                    }
                                }
                            }
                        }
                    }
                    data_ul.innerHTML=html;
                    data_allCity.appendChild(data_ul);
                    // 点击索引城市查询天气
                    data_allCity.onclick=function(e){
                        if(e.target.className==='city'){
                            var _city=e.target.innerText;
                            outWeather(_city);
                            scrollTo(0,0);
                        }
                    }
                }
            }
        }
        cityList_xhr.open('get','../api/data/region.json',true);
        cityList_xhr.send();
    }
    showCityList();


    function clickShowWeather(){
        
    }
    clickShowWeather();

    // 返回顶部
    window.onscroll=function(){
        if(window.scrollY>200){
            toTop.style.display="block";
        }else{
            toTop.style.display="none";
        }
    }
    toTop.onclick=function(){
        scrollTo(0,0);
    }

    // 显示当前时间
    var time=document.querySelector('.time');
    function showTime(){
        setInterval(function(){
            var now=new Date();
            time.innerHTML=now.format('YYYY 年 MM 月 DD 日 hh:mm:ss');
        },1000)
    }
    showTime();
})