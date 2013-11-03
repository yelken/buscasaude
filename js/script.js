//Variáveis Públicas
var actCoords = [];
var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var route = false;
var map;
var marker;
var geocoder;


/**Localização atual**/
function getLocation()
{
  if (navigator.geolocation)
    {
       	navigator.geolocation.getCurrentPosition(showPosition,error);

    }
  else{
  //	alert("naofoiGeolocation");
  		$("header").append("");
  		$("#mapa").css("display", "none");
  	}
}
  
function showPosition(position){
  actCoords = [position.coords.latitude,position.coords.longitude];
//  alert(position.coords.latitude);
  carregar();
}
function error(msg) {
   
}

/**Init**/
$(document).ready(function(){
	getLocation(); //pegar localização
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
	
	
	//Padrão do mapa
	var latlng = new google.maps.LatLng(-8.03458,-34.87078);
	
	actCoords[0] = -8.03458;
	actCoords[1] = -34.87078;
	
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
		draggable:true,
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
         
	
	var aqui = new google.maps.LatLng(-8.03458,-34.87078);
	marcadorPraca = new google.maps.Marker({
			position: aqui,
			map: map,
			title:"Você está aqui",
			icon: 'assets/map-marker.png'
	});
	
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
function inserirHospital(idLista,idBanco,nome,endereco,fone,distanciaKm,geo,especialidades){	
	
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
		params += "km="+distanciaKm+"&";
		params += "geo="+geo+"&";
		params += "especialidades="+especialidades;
	
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
	//var arrHospitais = [] ;//Array com Hospitais
	
	$("#resultados").append('<ul id="temp" style="display:none;"></ul>');
	
	//var arrDuino =
	$.ajax({
		url : "/hospitais/hospitais.json",
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
			var arrHospitais = retorno.hospitais;
		
			var posA = actCoords[0]+","+actCoords[1];
			
			var dist = new Array();
			var kmm = new Array();
			var distancia = 0;
			var distKm = 0;
		
			for (var n=0;n<=10;n++){
				var nome = retorno.hospitais[n].nome;
			
				var posB = retorno.hospitais[n].latitude+","+retorno.hospitais[n].longitude;
				var dMatrix = "http://maps.googleapis.com/maps/api/distancematrix/json?origins="+posA+"&destinations="+posB+"&mode=driving&language=pt-BR&sensor=false&units=metric&nome="+nome+";";
				$.ajax({
					url : dMatrix,
					cache : false,
					type : "get",
					dataType : "json",
					beforeSend : function() {
				},
				success : function(disRetorno) {
					
					 distancia = (disRetorno.rows[0].elements[0].distance.value);
					 distKm = (disRetorno.rows[0].elements[0].distance.text);
					$("#resultados #temp").append("<ul clas='dist'>"+distancia+"</ul>");
					$("#resultados #temp").append("<ul class='km'>"+distKm+"</ul>");
				}});
			}
		
	
		alert($("#temp .ul")[0].html());
						for (var i = 0; i <= 10; i++) {
							inserirHospital(
							i,
							retorno.hospitais[i].id,
							retorno.hospitais[i].nome,
							retorno.hospitais[i].endereco,
							"(81)8888-8888",
							distKm[i],
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


/**
* Carregar Mapa
*/
function carregarMapa(coorda,coordb,id){
	//Gerar novo Mapa
  	directionsDisplay = new google.maps.DirectionsRenderer();
  	geocoder = new google.maps.Geocoder();
  	var myLatlng = new google.maps.LatLng(coorda, coordb);	
  	var myOptions = {
		zoom: 15,
		center: myLatlng,
		streetViewControl:false,
		disableDoubleClickZoom:true,
		draggable:true,
		mapTypeControl:false,
		overviewMapControl:false,
		panControl:false,
		scaleControl:false,
		zoomControl:false,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		}
	//Verificar Largura da Janela para encaixar no mapa correto
	if($(window).width() < 800){
		$("#"+id).css("height","400px");
		//Repetir comando de Mapa para corrigir resto de Carregamento
  		map = new google.maps.Map(document.getElementById(id), myOptions);
  		map = new google.maps.Map(document.getElementById(id), myOptions);
  	}else{
  		//Repetir comando de Mapa para corrigir resto de Carregamento
  		map = new google.maps.Map(document.getElementById("mapa"), myOptions);
  		map = new google.maps.Map(document.getElementById("mapa"), myOptions);
  	}
  	directionsDisplay.setMap(map);
  	
    calcRoute(actCoords[0],actCoords[1],coorda,coordb); // Carregar Rota
  	//directionsDisplay.setPanel(document.getElementById("directionsPanel"));
}
/**Calcular a Rota**/
function calcRoute(startA,startB,endA,endB) {
	if (marker) marker.setMap(null);
	route = true;
   	var start = startA+","+startB;
   	var end = endA+","+endB;
   	var request = {
       origin:start, 
       destination:end,
       travelMode: google.maps.DirectionsTravelMode.DRIVING
   	};
   	directionsService.route(request, function(response, status) {
     if (status == google.maps.DirectionsStatus.OK) {
       directionsDisplay.setDirections(response);
     }
   });
}
