function gcd(a, b) {
    if (b == 0) {
        return a;
    } else {
        return gcd(b, a % b);
    }
}

function resize_image(img) {
  var width = img.naturalWidth;
  var height = img.naturalHeight;
  var divider = gcd(width, height);

  width = width / divider;
  height = height / divider;
  if (width * height < 7) {
    width *= 2;
    height *= 2;
  }

  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/png');
}

function send_data(image) {
  var items = Array.from(document.getElementsByClassName("color"));

  // resize loaded image
  image = resize_image(image);

  var request = new XMLHttpRequest();

  request.onload = function () {
     var status = request.status;
     var data = JSON.parse(request.responseText);
     if (data.status == 'ok') {
        // set image main colors
        items.forEach(function(div_color, i) {
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

    // clear div block
    var items = Array.from(document.getElementsByClassName("color"));
    items.forEach(function(div_color) {
      div_color.style.background = 'white';
    });

    // send image to server with timeout
    setTimeout(function() { send_data(imgtag); }, 10);
  };

  reader.readAsDataURL(selectedFile);
}