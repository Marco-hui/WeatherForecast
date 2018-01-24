<?php
    // 获取页面内容
    $content=file_get_contents("http://2017.ip138.com/ic.asp");
    // 转码
    $content=iconv('gbk','utf-8',$content);
    preg_match('/\[((?:\d{1,3}\.?){4})\]/',$content,$ip);
    // var_dump($ip);
    echo $ip[1];
    
    // $content=iconv('gbk','utf-8',file_get_contents('http://2017.ip138.com/ic.asp'));

    // preg_match('/\[((?:\d{1,3}\.?){4})\]/',$content,$ip);

    // echo $ip[1];
    
?>