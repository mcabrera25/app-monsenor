$(document).ready(function() {
	loadPosts(true);

	$(".old-posts, .new-posts").on("click",function(e){
		hideBotonesdePaginacion();
		e.preventDefault();
		var identificador = $(this).data("identificador");
		var pageNumber = parseInt(localStorage.getItem("page-number"));
		
		//identificador {1=Cargar mas recientes; 0;Cargar mas viejos}
		if (identificador==0){
			pageNumber += 1;			
		} else if (identificador == 1 && pageNumber>1){
			pageNumber -= 1;
		}
		localStorage.setItem("page-number", pageNumber);
		loadPosts(false);
	});


	function loadPosts(start=true){
		hideBotonesdePaginacion();
		var categoriaId = localStorage.getItem("category-id");		
		if (start) {//Si se invoca esta funcion al cargar el documento/aplicactio/vista
			localStorage.setItem("page-number", 1); //Gardar en el LS que la paginacion es la #1
			localStorage.setItem("post-single", 0);// no es un post en especifico/en-detalle, sino, una lista.
			pageNumber = 1;//La paginacion debe iniciar por 1.
		}else{//Si no se ha invocado la function cuando el documento esta ready (sino, cunado se le da click a uno de los botones de anterior-siguiente), entonces:
			pageNumber = parseInt(localStorage.getItem("page-number"));
		}

		// console.log(categoriaId, pageNumber);
	  $.ajax({
		  url: "http://www.monsdelarosa.org/wp-json/wp/v2/posts?&categories=" + categoriaId + "&page=" + pageNumber,
		  type: 'GET',
		  dataType: 'json',
		  beforeSend: function () {
			  $('#loader').show();
			  $(".post-container").html("");
		  },
		  success: function (data) {
			  $('#loader').hide();

			  if (data.length > 0) {

				  for (var i = 0; i < data.length; i++) {

					  var date = new Date(data[i].date);
					  var excerpt = data[i].excerpt.rendered;
					  excerpt = excerpt.substring(0, 110);
					  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
					  date = date.toLocaleDateString("es-ES", options);
					 	console.log(data[i]);
					  if (data[i].better_featured_image == null) {

						  var url_img = "http://www.monsdelarosa.org/wp-content/uploads/2018/03/generic-150x150.png";

					  } else if (data[i].better_featured_image.media_details.sizes.thumbnail == null){
						  var url_img = data[i].better_featured_image.source_url;
					  } else{
						  var url_img = data[i].better_featured_image.media_details.sizes.thumbnail.source_url;	
					  }

					  var html = "<div class='post-wrapper' data-id='" + data[i].id + "'>" +
						  "<h5 class='post-title'>" + data[i].title.rendered + "</h5>"
						  + "<p class='post-date'>" + date + "</p>"
						  + "<div class='post-img-w'>"
						  + "<div class='post-img' style=\"background-image: url('" + url_img + "')\">" + "</div>"
						  + "</div>"
						  + "<div class='post-content'>" + excerpt + "</div>"
						  + "</div>";


					  $(".post-container").append(html);
					  $(".post-container br").hide();
					  $(".post-content p:last").append("<span>...</span>");
				  }

			  } else {

				  var aviso = "<h4>No hay contenido para mostrar.</h4> <h5>Favor volver al menú principal</h5>";
				  $(".post-container").html(aviso);

			  }
		  }
	  });

		var noticiasLength = totalPostsByCategoryId(categoriaId);
		var numeroPorDefectoDePotsPorPaginas = 10;//Esta variable puede/podria ser dianmica
		var totalDePaginasaMostrar = Math.ceil(noticiasLength / numeroPorDefectoDePotsPorPaginas);
		utlimaPagina = totalDePaginasaMostrar == pageNumber ? true : false;
		
	  	//Condiciones de cuando se debe mostrar el boton de ver los viejos posts.
		if ((pageNumber < totalDePaginasaMostrar)){//
			$(".old-posts").css("display", "inline-block");//Mostramos el boton de mostrar mas antiguos posts, porque no hay mas.
		}else{
			$(".old-posts").css("display", "none");//Ocultamos el boton de mostrar mas antiguos posts, porque no hay mas.
		}		
		//Condiciones de cuando se debe mostrar el boton de ver los nuevos posts.
		if (pageNumber>1){
			$(".new-posts").css("display", "inline-block");
		}else{
			$(".new-posts").css("display", "none");
		}
		
	}//end of function loadPosts();
   
	function hideBotonesdePaginacion() {
		$(".old-posts").css("display", "none");
		$(".new-posts").css("display", "none");
	}
	function totalPostsByCategoryId(categoriaId,per_page=100){
		//IMPORTANTE: Hay que validar o menejar cuando haya una categoria con mas de 100 posts.

		console.log("categoriaId: ", categoriaId, "per_page: ", per_page);
		var countData = false; 
		$.ajax({
			url: "http://www.monsdelarosa.org/wp-json/wp/v2/posts?&categories=" + categoriaId + "&per_page="+per_page,
			type: 'GET',
			async:false,
			dataType: 'json',
			success: function (data) {
				countData = parseInt(data.length);
				console.log("countData : "+countData);
			}
		})
		return countData;
	}
	var title = localStorage.getItem("category-title");

	$(".section-title h1").append(title);


	$(document).on("click", ".post-wrapper", function(){
		hideBotonesdePaginacion();
		var post = $(this).data("id");		
		localStorage.setItem("post-single", 1);
		$(".section-title h1").html("");

		$.ajax({
			url: 'http://www.monsdelarosa.org/wp-json/wp/v2/posts/'+ post,
			type: 'GET',
			dataType: 'json',
			beforeSend: function() {
				$(".post-container").html("");
				$('#loader').show();
			},
			
			success: function(data){							

				$('#loader').hide();
				$("#back-arrow").attr("data-location", "1");		

				var date = new Date(data.date);
				var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
				date = date.toLocaleDateString("es-ES", options);

				if (data.better_featured_image == null){
					var url_img = "http://www.monsdelarosa.org/wp-content/uploads/2018/03/generic.png";						
				} else {
					var url_img = data.better_featured_image.source_url;
				}

				var html = "<div class='posts animated fadeIn'>" + 
				"<div class='featured-img' style=\"background-image: url('"+ url_img +"')\">"+"</div>"
				+ "<h4>" + data.title.rendered + "</h4>"
				+ "<p class='post-date'>" + date + "</p>"	
				+ "<div class= 'text-justify'>" + data.content.rendered + "</div>"
				+ "</div>";	

				$(".post-container").append(html);


			}
		});

	});

	$("#back-arrow").on("click", function(e){
		e.preventDefault();
		if ($("#back-arrow").data("location") == 1) {
			location.reload();

		} else {
			window.location.assign("index.html");
		}

	});

	
});




