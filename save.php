<?
include("config.php");
$id=$_POST['id'];
$user_id=$_POST['board'];
$text=$_POST['text'];
$x=$_POST['x'];
$y=$_POST['y'];
$color=$_POST['color'];


$q=mysql_query("SELECT * FROM notes WHERE id='$id' AND user_id='$user_id'");

if(mysql_num_rows($q) == 0){
mysql_query("INSERT INTO notes VALUES(NULL,'$user_id','$text','$x','$y','$color')");
}else{
mysql_query("UPDATE notes SET text='$text', x='$x', y='$y', color='$color' WHERE id='$id' AND user_id='$user_id'");
}

echo mysql_insert_id();

?>