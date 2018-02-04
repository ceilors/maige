function send_data(image) {
  var request = new XMLHttpRequest();

  request.onload = function () {
     var status = request.status;
     var data = JSON.parse(request.responseText);
     if (data.status == 'ok') {
        var items = Array.from(document.getElementsByClassName("color"));
        items.forEach(function(div_color, i) {
            console.log( data.colors[i] );
            div_color.style.background = 'rgb(' + data.colors[i] + ')';
        });
     }
  }
  request.open('post', '/', true);

  var formData = new FormData();
  formData.append('file', image);

  request.send(formData);
}

function select_file(event) {
  var selectedFile = event.target.files[0];
  var reader = new FileReader();

  var imgtag = document.getElementsByClassName("result_image")[0];
  imgtag.title = selectedFile.name;

  reader.onload = function(event) {
    imgtag.src = event.target.result;
  };

  reader.readAsDataURL(selectedFile);

  send_data(selectedFile);
}