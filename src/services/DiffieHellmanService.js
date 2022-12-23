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

        console.log("Start Diffie-Hellman")
        const alice = crypto.createDiffieHellman(258);
        const aliceKey = alice.generateKeys('hex');
    
        const prime = alice.getPrime('hex')
        console.log("user_prime")
        console.log(prime)
        const generator = alice.getGenerator('hex')
        console.log("user_generator")
        console.log(generator)
        console.log("End Diffie-Hellman")

        const encrypted_prime = await crypto.publicEncrypt(server_public_key, Buffer.from(prime));
        const encrypted_generator = await crypto.publicEncrypt(server_public_key, Buffer.from(generator));
        const encrypted_key = await crypto.publicEncrypt(server_public_key, Buffer.from(aliceKey));

        //const encrypted_payload = await crypto.publicEncrypt(public_key, Buffer.from(prime));
        //let str = await crypto.privateDecrypt(private_key, encrypted_payload).toString('utf-8')
        //console.log(str)


        //TODO ver se só se pode assinar um valor
        const sign = crypto.createSign('RSA-SHA256');
        sign.write(encrypted_prime);
        sign.end();
        const signature = await sign.sign(private_key);

        //TEST À ASSINATURA:
        const verify = crypto.createVerify('RSA-SHA256');
        verify.write(encrypted_prime);
        verify.end();
        console.log("Verify signature")
        console.log(verify.verify(public_key, signature));

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

        console.log("Start Request")
        const response_json = await fetch('diffie', requestOptions);
        const response = await response_json.json()
        console.log("response")
        console.log(response)

        const signature_response = response.signature;
        const keysession_encrypted = response.serverkey;

        const keysession = crypto.privateDecrypt(private_key, Buffer.from(keysession_encrypted));
        console.log(keysession.toString('hex'))

        //await crypto.privateDecrypt(private_key, encrypted_payload).toString('utf-8')

        //const aliceSecret = alice.computeSecret(bobKey);

        //return await response.json()
    }catch(error){
        console.log(error)
        return []
    }
}