const sm2 = require('sm-crypto').sm2
const cipherMode = 1

function sm2doEncrypt(value,publicKey){
    return sm2.doEncrypt(value, publicKey, cipherMode)
}
//sm3加密
function sm3doEncrypt(value){
    const sm3 = require('sm-crypto').sm3
    return sm3(value);
}

// hex转json字符串,16进制ASCII
// function hextoString(hex) {
//     let arr = hex.split("")
//     let out = ""
//     for (let i = 0; i < arr.length / 2; i++) {
//         let tmp = "0x" + arr[i * 2] + arr[i * 2 + 1]
//         let charValue = String.fromCharCode(tmp);
//         out += charValue
//     }
//     return out
// }

// json字符串转hex
// function stringtoHex(str) {
//     var val = "";
//     for (var i = 0; i < str.length; i++) {
//         if (val == "")
//             val = str.charCodeAt(i).toString(16);
//         else
//             val += str.charCodeAt(i).toString(16);
//     }
//     val += "0a"
//     return val
// }


export {
    sm2doEncrypt,
    sm3doEncrypt
}