<?
include("config.php");
$id=$_POST['id'];
$user_id=$_POST['board'];
mysql_query("DELETE FROM notes WHERE id='$id' AND user_id='$user_id'");
echo $_POST['id'];


?>