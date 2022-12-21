import private_key_dir from '../keys/server.key';
import public_key_dir from '../keys/public.key';

import server_public_key_dir from '../keys/backendpublic.key';



var crypto = require('crypto-browserify');
var buffer = require('buffer-browserify');
//var fs = require('fs'); 

export async function get_user_information(token){
    try {
        
        var res = await fetch(private_key_dir)
        var private_key = await res.text()
        
        var res = await fetch(public_key_dir)
        var public_key = await res.text()

        console.log(public_key)
        
        var res = await fetch(server_public_key_dir)
        var server_public_key = await res.text()

    
        const alice = crypto.createDiffieHellman(258);
        const aliceKey = alice.generateKeys('hex');
    
        const prime = alice.getPrime('hex')
        console.log(prime)
        const generator = alice.getGenerator('hex')

        const encrypted_prime = await crypto.publicEncrypt(server_public_key, Buffer.from(prime));
        const encrypted_generator = await crypto.publicEncrypt(server_public_key, Buffer.from(generator));
        const encrypted_key = await crypto.publicEncrypt(server_public_key, Buffer.from(aliceKey));

        //const encrypted_payload = await crypto.publicEncrypt(public_key, Buffer.from(prime));
        //let str = await crypto.privateDecrypt(private_key, encrypted_payload).toString('utf-8')
        //console.log(str)

        console.log("PUBLIC ENCRYPT");


        //TODO ver se só se pode assinar um valor
        const sign = crypto.createSign('RSA-SHA256');
        sign.write(encrypted_prime);
        sign.end();
        const signature = await sign.sign(private_key);


        //TEST À ASSINATURA:
        const verify = crypto.createVerify('RSA-SHA256');
        verify.write(encrypted_prime);
        verify.end();
        console.log(verify.verify(public_key, signature));

        console.log(signature)

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                token: token, 
                signature: signature, 
                prime: encrypted_prime,
                generator: encrypted_generator,
                key: encrypted_key
            })
        };

        const response = await fetch('diffie', requestOptions);
        console.log(await response.json())

        //await crypto.privateDecrypt(private_key, encrypted_payload).toString('utf-8')

        //const aliceSecret = alice.computeSecret(bobKey);

        //return await response.json()
    }catch(error){
        console.log(error)
        return []
    }
}

const urlDecodeBytes = (encoded) => {
    let decoded = Buffer.from('')
    for (let i = 0; i < encoded.length; i++) {
      if (encoded[i] === '%') {
        const charBuf = Buffer.from(`${encoded[i + 1]}${encoded[i + 2]}`, 'hex')
        decoded = Buffer.concat([decoded, charBuf])
        i += 2
      } else {
        const charBuf = Buffer.from(encoded[i])
        decoded = Buffer.concat([decoded, charBuf])
      }
    }
    return decoded
}

const urlEncodeBytes = (buf) => {
    let encoded = ''
    for (let i = 0; i < buf.length; i++) {
      const charBuf = Buffer.from('00', 'hex')
      charBuf.writeUInt8(buf[i])
      const char = charBuf.toString()
      // if the character is safe, then just print it, otherwise encode
      if (isUrlSafe(char)) {
        encoded += char
      } else {
        encoded += `%${charBuf.toString('hex').toUpperCase()}`
      }
    }
    return encoded
  }

const isUrlSafe = (char) => {
    return /[a-zA-Z0-9\-_~.]+/.test(char)
}