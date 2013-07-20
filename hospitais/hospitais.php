<?php
$username = 'buscasaude';
$password = 'abc1020';
$hostname = 'mysql.buscasaude.uni5.net'; 
$database = 'buscasaude';

$dbhandle = mysql_connect($hostname, $username, $password) 
 or die("Não é possível conectar ao MySQL");

$selected = mysql_select_db($database,$dbhandle) 
  or die("Não foi possível conectar em buscasaude");

$result = mysql_query('SELECT * FROM HOSPITAL');

if($result === FALSE) {
    die(mysql_error());
}

// Criar arquivo JSON 

$jsonStr = '{"hospitais": [';

$hospitalObj = '';

while ($row = mysql_fetch_array($result)) {
   $hospitalObj = $hospitalObj.'{"nome": ' . '"' . $row{'NOME'} . '"' . ', ' . '"tipo": ' . '"' . $row{'TIPO'} . '"' . ', '  .'"especialidades": ' .  '"' . $row{'ESPECIALIDADES'} .  '"' . ', ' . '"endereco": ' . '"' . $row{'ENDERECO'} . '"' . ', ' . '"bairro": ' . '"' . $row{'BAIRRO'} . '"' . ', ' . '"latitude": ' . $row{'LATITUDE'} . ', ' . '"longitude": ' . $row{'LONGITUDE'} . '}' . ',';
}

$hospitalObj = substr($hospitalObj, 0, -1);
$jsonStr = $jsonStr . $hospitalObj .']}';

echo $jsonStr;

mysql_close($dbhandle);
?>