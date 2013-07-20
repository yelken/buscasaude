<?php
	header('Content-Type: text/html; charset=utf-8');
	
	$idLista  		= trim($_REQUEST['id_lista']);
	$idBanco 		= trim($_REQUEST['id_banco']);
	$nome  			= trim($_REQUEST['nome']);
	$endereco 		= trim($_REQUEST['endereco']);
	$fone   		= trim($_REQUEST['fone']);
	$geo   			= trim($_REQUEST['geo']);
	$especialidades = trim($_REQUEST['especialidades']);
	$km				= trim($_REQUEST['km']);
	$geo			= split(",", $geo);
	$especialidades = split(",", $especialidades);
?>
<?php if($idLista==0): ?>
	<div id="maisPerto" class="mais_proximo">
		este é o local mais próximo
	</div>
<?php endif; ?>
<header>
	<h1 id="nomeHospital" class="titulo_hospital" >
		<?php echo utf8_encode($nome); ?>
	</h1>
</header>
<div id="dadosHospital" class="area_dados_hospital">
	<div id="status" class="status">
	</div>
	<div id="endereco" class="endereco">
		<address>
			<?php echo utf8_encode($endereco); ?>
		</address>
		<div id="distancia" class="distancia">
			<?php echo utf8_encode($km); ?>
		</div>
		<div id="foneHospital" class="fone">
			<?php echo utf8_encode($fone); ?>
		</div>
		<div id="nota" class="estrelas">
			<a href="#" onmouseout="outEstrelas(event)" onmouseover="rollEstrelas(event)" class="e-1">e</a>
			<a href="#" onmouseout="outEstrelas(event)" onmouseover="rollEstrelas(event)" class="e-2">e</a>
			<a href="#" onmouseout="outEstrelas(event)" onmouseover="rollEstrelas(event)" class="e-3">e</a>
			<a href="#" onmouseout="outEstrelas(event)" onmouseover="rollEstrelas(event)" class="e-4">e</a>
			<a href="#" onmouseout="outEstrelas(event)" onmouseover="rollEstrelas(event)" class="e-5">e</a>
		</div>
	</div>
	<div id="especializadades" class="especialidades">
		<h2>Especialidades:</h2>
		<ul id="lisEspecialidades" class="lista_especialidades">
			<?php for($i=0;$i<count($especialidades);$i++):?>
				<li><?php echo utf8_encode($especialidades[0]); ?></li>
			<?php endfor;?>
		</ul>
	</div>
	<div id="exibir" class="exibir">
		<button id="exibirMapa" class="exibir_mapa" onclick="carregarMapa(<?php echo $geo[0]; ?>,<?php echo $geo[1];?>, 'mapa_<?php echo $idBanco;?>')">
			Exibir no Mapa
		</button>
	</div>
	<div id="mapa_<?php echo $idBanco; ?>" class="mapa_hospital mapa_hospital<?php echo $idLista; ?>">
	</div>
</div>