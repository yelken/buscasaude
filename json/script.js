$(document).ready(function(){
  $("#botao").click(function(){
   		getHospitais();
  });
});

function getHospitais(){
	$.ajax({
		url : "json.html",
		cache : false,
		type : "get",
		dataType : "json",
		beforeSend : function() {

		},
		error : function(retorno) {
			alert(retorno);
		},
		success : function(retorno) {
		var quant = retorno.hospitais.length;
		
		for (var i = 0; i < quant; i++) {
			$("#resultado").html($("#resultado").html() + 'INSERT INTO HOSPITAL (NOME, ENDERECO, TIPO, LATITUDE, LONGITUDE) VALUES (' + '"' + retorno.hospitais[i].NOME + '"' +',' + '"' + retorno.hospitais[i].ENDERECO + '"' + "," + '"' + retorno.hospitais[i].TIPO + '"' + ',' + '"' + retorno.hospitais[i].LATITUDE + '"' + ',' + '"' + retorno.hospitais[i].LONGITUDE + '"' + '); ');
			}
		}
	});
}