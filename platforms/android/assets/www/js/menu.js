$(document).ready(function() {
	$.ajax({
		url: "http://www.monsdelarosa.org/wp-json/wp/v2/categories?orderby=id&order=asc&exclude=1&per_page=100",
		type: 'GET',
		dataType: 'json',
		beforeSend: function() {
			$('#loader').show();
		},
		success: function(data){
			$('#loader').hide();
			var menu = $("#main-menu");
			$.each(data, function(i, value){
				var html = "<li><a href='#' class='menu-link' data-category='"+ value.id +"'>"+ value.name +"</a></li>"				
				menu.append(html);
			});

			var html = "<li><a href='redes.html'>Redes sociales</a></li>";
			
			menu.append(html);
		}
	});

	$(document).on("click", ".menu-link", function(e){
		e.preventDefault();
		localStorage.setItem("category-id", $(this).data("category"));
		localStorage.setItem("category-title", $(this).html());

		window.location.assign("noticias.html");
	});	

});