<?php
    $ip=isset($_GET['ip']) ? $_GET['ip'] : null;
    $content=file_get_contents("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=$ip");
    $content=json_decode($content,true);
    // var_dump($content);

    echo $content['city'];
    
    // $ip=isset($_GET['ip']) ? $_GET['ip'] : null ;

    // $content=file_get_contents("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=$ip");

    // echo(json_decode($content,true)['city']) ;
?>