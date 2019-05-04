var lis = document.getElementsByClassName('tab');
	for(var i=0; i<lis.length; i++){
		lis[i].onclick = function(){
			var that = this;
			for(var i=0; i<lis.length; i++){
				lis[i].classList.remove('active')
				this.classList.add('active')
			}
		}
	}

