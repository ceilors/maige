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

  // calc new image size
  width = width / divider;
  height = height / divider;
  if (width * height < 50) {
    width *= 2;
    height *= 2;
  }

  // resize image
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(img, 0, 0, width, height);

  // get base64 data
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
        // set main colors in div blocks
        items.forEach(function(div_color, i) {
            div_color.style.background = 'rgb(' + data.colors[i] + ')';
        });
     }
  }

  // check for using hsv pallete
  var is_hsv_checked = document.getElementsByClassName("hsv_pallete")[0].checked;
  
  request.open('post', '/', true);

  var formData = new FormData();
  formData.append('file', image);
  formData.append('hsv', is_hsv_checked);

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