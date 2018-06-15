//=====================================================
// <img>要素 → Base64形式の文字列に変換
//   img       : HTMLImageElement
//   mime_type : string "image/png", "image/jpeg" など
//=====================================================
const ImageToBase64 = (img, mime_type) => {

    // New Canvas
    var canvas = document.createElement('canvas');
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    // Draw Image
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    // To Base64

    document.body.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.width = "100%";

    setTimeout( () => {
        console.log(1);
        console.log(canvas.toDataURL(mime_type));
    },1000 )

    return canvas.toDataURL(mime_type);
}


const toBlob = (base64,mime_type) => {

    var bin = atob(base64.replace(/^.*,/, ''));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    // Blobを作成
    try{
        var blob = new Blob([buffer.buffer], {
            type: mime_type
        });
    }catch (e){
        return false;
    }
    return blob;
}



const ImgToBlob = (img,mime_type) => {

    let base64 = ImageToBase64(img, (mime_type || "image/jpeg") );
    let blob = toBlob(base64, (mime_type || "image/jpeg"));

    return blob;

}

export default ImgToBlob;
