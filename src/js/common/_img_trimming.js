const toBlob = (base64,type,callback) => {

    var bin = atob(base64.replace(/^.*,/, ''));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    // Blobを作成
    try{
        var blob = new Blob([buffer.buffer], {
            type: type
        });
        callback(blob);
    }catch (e){
        return false;
    }

}

const ImgTrim = (file, callback) => {

    let type = file.type;
    let maxWidth = 640;

    let fileReader = new FileReader();
    fileReader.onload = (e) => {

        let img = new Image();
        img.onload = (e) => {

            let width = img.naturalWidth,
                height = img.naturalHeight,
                aspect = height / width;

            let canvas = document.createElement('canvas');

            if( width < height && height > maxWidth ) { // 縦長
                width  = maxWidth / aspect;
                height = maxWidth;
            }
            if ( width >= height && width > maxWidth ) { // 横長
                width  = maxWidth;
                height = maxWidth * aspect;
            }

            canvas.width  = width;
            canvas.height = height;

            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // document.body.appendChild(canvas);
            // canvas.style.position = "fixed";
            // canvas.style.width = "100%";

            toBlob( canvas.toDataURL(type), type, callback );

        };
        img.src = fileReader.result;

    }
    fileReader.readAsDataURL(file);

    // var canvas = document.createElement('canvas');
    // canvas.width  = img.naturalWidth;
    // canvas.height = img.naturalHeight;

    // var ctx = canvas.getContext('2d');
    // ctx.drawImage(img, 0, 0);
    //
    // return canvas.toDataURL(mimeType);

}



export default ImgTrim;
