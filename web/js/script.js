/**
Script de Inserção e configuração dos hospitais

@author Rodrigo Portillo
@date 2013-07-18
*/

//Variáveis Públicas
var actCoords = [];

/**Localização atual**/
function getLocation()
{
  if (navigator.geolocation)
    {
    	navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{
  		$("header").append("<input type='text'></>");
  		$("#mapa").css("display", "none");
  	}
}
  
function showPosition(position){
  actCoords = [position.coords.latitude,position.coords.longitude];
  carregar();
}

//Init
getLocation(); //pegar localização

/**Init**/
$(document).ready(function(){
  $("#btnSubmit").click(function(){
   		getHospitais();
   		goToByScroll("#resultados");
  });
});
//carregar div do mapa
$(document).ready(function(){
    if ($("#mapa").text().length > 0) {
		$('#mapa').hide();
	} else{
		$('#mapa').show(); 
	}              
});


//Mapa Original
var map = null; 
function carregar(){
	//alert(actCoords[0]+","+actCoords[1]);
	var latlng = new google.maps.LatLng(actCoords[0],actCoords[1]);
	
	if(actCoords[0] == undefined || actCoords[0] == null){
		$("#mapa").css("display", "none");
	}else{
		$("#mapa").css("display", "block");
	}
	
	     
	
	var myOptions = {
		zoom: 14,
		center: latlng,
		streetViewControl:false,
		disableDoubleClickZoom:true,
		draggable:false,
		mapTypeControl:false,
		overviewMapControl:false,
		panControl:false,
		scaleControl:false,
		zoomControl:false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	//criando o mapa
	map = new google.maps.Map(document.getElementById("mapa"), myOptions);
	
	while ($("#mapa").text().length > 0) {
		$('#mapa').hide();
	} 
	$('#mapa').show();
         
	
	var aqui = new google.maps.LatLng(actCoords[0],actCoords[1]);
	marcadorPraca = new google.maps.Marker({
			position: aqui,
			map: map,
			title:"Você está aqui",
			icon: 'assets/map-marker.png'
		});
}
    	
function rollEstrelas(event){
	$(event.target).addClass("amarela");
}
function outEstrelas(event){
	$(event.target).removeClass("amarela");
}

/**
* Inserir novo Hospital (resultado)
* @params id:int, nome:char, endereco:char,fone:char,geo:array,especialidades:array
*/
function inserirHospital(idLista,idBanco,nome,endereco,fone,geo,especialidades){	
	
	//Adicionar Container de Hospital
	if(idLista%2 == 0){
		$("#resultados").append("<article id='hospital_"+idLista+"' class='hospital_"+idLista+" hospital_"+idBanco+" hospital'></article>");
	}else{
		$("#resultados").append("<article id='hospital_"+idLista+"' class='hospital_"+idLista+" hospital_"+idBanco+" hospital hospital_alt'></article>");
	}
	
	var params  = "";
		params += "id_lista="+idLista+"&";
		params += "id_banco="+idBanco+"&";
		params += "nome="+nome+"&";
		params += "endereco="+endereco+"&";
		params += "fone="+fone+"&";
		params += "geo="+geo+"&";
		params += "especialidades="+especialidades+"&";
	
	$.ajax({
		url:"/objetos/hosp_res.php?" + params,
		cache : false,
		type : "get",
		error : function(retorno) {
			$("#hospital_"+idLista).append("Erro no Sistema");
		},
		success : function(retorno) {
			$("#hospital_"+idLista).html(retorno);		
			$("#hospital_"+idLista).animate({opacity: 1});
		}
	});
}

/**
* Inserir Todos os Hospitais
*/
function getHospitais(){
	$.ajax({
		url : "/hospitais/hospitais.php",
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
		
		for (var i = 0; i < 10; i++) {
			inserirHospital(
				i,
				retorno.hospitais[i].id,
				retorno.hospitais[i].nome,
				retorno.hospitais[i].endereco,
				"(81)8888-8888",
				new Array(retorno.hospitais[i].latitude, retorno.hospitais[i].longitude),
				new Array(retorno.hospitais[i].especialidades)
				);
			}
			
			goToByScroll("#resultados");			
		}
	});
}

/**
* Ir suavemente para uma ID
*/
function goToByScroll(id){
    $("body,html").animate({
        scrollTop: $(id).offset().top},
    'slow');
}