var app = function(){
	
	return {
		/**
		 * common
		 */
		$: function(id){
			if(!id){
				return null;
			}
			return document.getElementById(id);
		},
		addEvent: function(id, event, callBack){
			var obj = $(id);
			if (obj.addEventListener) {
				obj.addEventListener(event, callBack, false);
			}
			else{
				obj.attachEvent('on'+event, callBack, false);
			}
		},
		getURLParameter: function(name) {
		  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
		},
		back: function(){
			document.location = "index.html";
		},
	
		/**
		 * contacts read
		 */
		contactsRead: function(){
			
			var filter = {
				  sortBy: "name",
				  sortOrder: "descending"
			};

			var allContacts = navigator.mozContacts.getAll(filter); 
				
			allContacts.onsuccess = function (event) {
				var cursor = event.target;
				var tmpl = '';
				var person = {};
				if (cursor.result) {
					person.id = cursor.result.id;
					person.name = cursor.result.name || '';
					person.tel = cursor.result.tel ?  cursor.result.tel[0].value : '';
                    if (cursor.result.photo!=null && cursor.result.photo[0]!=null){
                        person.photo = window.URL.createObjectURL(cursor.result.photo[0]);
                        var reader = new FileReader();
                        reader.readAsDataURL(cursor.result.photo[0]);//Convert the blob from clipboard to base64
                        reader.onload = function(event){
                            person.imageData = event.target.result;
//                            console.log(person.imageData);
                            $$('#c'+person.id).attr("data-imgdata",person.imageData);
//                            var base64Content = imageData.substring(imageData.indexOf(',') + 1, imageData.length);
                        }
                    }else {
                        person.photo = "images/avatar.png";
                        person.imageData = "";
                    }
			  	tmpl += '<li id="c' + person.id + '">';
                tmpl += '	<img src="' + person.photo + '">';
			  	tmpl += '	<a href="#">';
			  	tmpl += '	<p class=personname>' + person.name + '</p>';
			  	tmpl += '	<p class=persontel>' + person.tel + '</p>';
			  	tmpl += '	</a>';
			  	tmpl += '</li>';
			  	
			  	$('contactsList').innerHTML += tmpl;
			  	cursor.continue();
			  } 
				else {
			  	console.log('No more contacts');
			  }
			}
			
			allContacts.onerror = function() {
				console.warn("Something went terribly wrong! :(");
			}
		}
	} //-- return
}();

window.$ = app.$;
