<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:rss="http://backend.userland.com/rss2">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Мои записочки</title>
<script type="text/javascript">
<!--
		_refresh_timeout = 3600;
--></script>
<link href="/notes/sticker.css" media="screen" rel="stylesheet" type="text/css" />
<script src="/notes/prototype-1.6.0.2.js" type="text/javascript"></script>
<script src="/notes/scriptaculous.js?load=effects,dragdrop" type="text/javascript"></script>
<script src="/notes/webtoolkit.utf8.js" type="text/javascript"></script>
<script src="/notes/sticker.js" type="text/javascript"></script>
<script src="/notes/window.js" type="text/javascript"></script>
<link href="/notes/default.css" rel="stylesheet" type="text/css" />
<link href="/notes/lighting.css" rel="stylesheet" type="text/css" />
<!--[if gte IE 5.5]>
<![if lt IE 7]>
<style type="text/css">
div#fixme {
  /* IE5.5+/Win - this is more specific than the IE 5.0 version */
  right: auto; bottom: auto;
  left: expression( ( -20 - fixme.offsetWidth + ( document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth ) + ( ignoreMe2 = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ) ) + 'px' );
  top: expression( ( -10 - fixme.offsetHeight + ( document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight ) + ( ignoreMe = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ) ) + 'px' );
}
</style>
<![endif]>
<![endif]--></head><body onload="glueStickers();"><script type="text/javascript"><!--
			var board = '1';
			var saveURL = '/save.php';
			var deleteURL = '/delete.php';
			var newBoardURL = '/save.php';
			var removeBoardURL = '/save.php';
			var renameBoardURL= '/save.php';
			var subscribeBoardURL= '/save.php';
			var closeIMG = '/notes/close.gif';
		--></script>
<?
include("config.php");
?>
<table id="menu"><tr><td class="active_page"><span id="current_tab">Мои записочки</span></td><td class="buttons"></td><td class="enter"></td></tr></table>
<form id="stickers">
<?
$query = "SELECT * FROM notes WHERE user_id='1'";
$result = mysql_query($query);
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
echo '<textarea id="s'.$row['id'].'" style="left:'.$row['x'].'px;top:'.$row['y'].'px;z-index:'.$row['color'].'">'.$row['text'].'</textarea>';
    }
?>
</form><div id="em_x">x</div><div id="fixme"></div></body></html>
