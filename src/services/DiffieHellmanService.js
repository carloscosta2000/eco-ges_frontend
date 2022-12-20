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
        
        var res = await fetch(server_public_key_dir)
        var server_public_key = await res.text()

    
        const alice = crypto.createDiffieHellman(128);
        const aliceKey = alice.generateKeys('hex');
    
        const prime = alice.getPrime('hex')
        const generator = alice.getGenerator('hex')

        const encrypted_payload = await crypto.publicEncrypt(server_public_key, Buffer.from(JSON.stringify({prime: prime, generator: generator, key: aliceKey.toString('hex')})));
        console.log("PUBLIC ENCRYPT");



        const sign = crypto.createSign('RSA-SHA256');
        sign.write(encrypted_payload.toString('utf-8'));
        sign.end();
        const signature = await sign.sign(private_key);

        // TEST À ASSINATURA:
        // const verify = crypto.createVerify('RSA-SHA256');
        // verify.write(encrypted_payload.toString('utf-8'));
        // verify.end();
        // console.log(verify.verify(public_key, signature));

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, signature: signature, payload: encrypted_payload})
        };

        const response = await fetch('diffie', requestOptions);

        //const aliceSecret = alice.computeSecret(bobKey);

        //return await response.json()
    }catch(error){
        console.log(error)
        return []
    }
}

function readFile(file) {
    return new Promise((resolve, reject) => {
      // Create file reader
      let reader = new FileReader()

      // Read file
      reader.readAsArrayBuffer(file)
    })
  }