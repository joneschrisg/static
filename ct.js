const url = new URL(window.location.href);

async function digestMessage(message) {
    if (crypto==null){
        return "";
    }
    if (crypto.subtle==null){
        return "";
    }
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-512', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

async function collectCanvasFp() {
    var result = [];
    // Very simple now, need to make it more complex (geo shapes etc)
    var canvas = document.createElement('canvas');
    canvas.width = 2000; //ZS: change width to sa 180 from 2000
    canvas.height = 200;
    canvas.style.display = 'inline';
    var ctx = canvas.getContext('2d');
    if (ctx == null) {
        return [];
    }
    // detect browser support of canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
    ctx.rect(0, 0, 10, 10);
    ctx.rect(2, 2, 6, 6);
    result.push('canvas winding:' + ((ctx.isPointInPath(5, 5, 'evenodd') === false) ? 'yes' : 'no'));

    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.font = '11pt no-real-font-123';
    ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 2, 15); //ZS try different text and it should again be changed in 3 lines below this
    ctx.fillStyle = 'rgba(102, 204, 0, 0.2)';
    ctx.font = '18pt Arial';
    ctx.fillText('Cwm fjordbank glyphs vext quiz, \ud83d\ude03', 4, 45);
    // canvas blending
    // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
    // http://jsfiddle.net/NDYV8/16/
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgb(255,0,255)';
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(0,255,255)';
    ctx.beginPath();
    ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(255,255,0)';
    ctx.beginPath();
    ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(255,0,255)';
    // canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // http://jsfiddle.net/NDYV8/19/
    ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
    ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
    ctx.fill('evenodd');

    /* XXX/NB: Chris edit
       if (canvas.toDataURL) { result.push('canvas fp:' + canvas.toDataURL()); }
    */
    var dataUrl = '';
    if (canvas.toDataURL) {
        dataUrl = canvas.toDataURL();
        result.push('canvas fp:' + dataUrl);
    }
    
    var digestHex = await digestMessage(result);
    /* XXX/NB: Chris edit
       if (digestHex==""){
       return [];
       }
       return [["canvasHash", digestHex]];
    */
    return {
        canvasDataUrl: dataUrl,
        canvasHash: digestHex,
    };
}
