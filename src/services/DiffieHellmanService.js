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
        const alice = crypto.createDiffieHellman(256);
        const aliceKey = alice.generateKeys('hex');
        console.log("Alice Key:")
        console.log(aliceKey.toString('hex'))

    
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
        // const verify = crypto.createVerify('RSA-SHA256');
        // verify.write(encrypted_prime);
        // verify.end();
        // console.log("Verify signature")
        // console.log(verify.verify(public_key, signature));

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
        const response = await response_json.json();

        if("error" in response){
            return false;
        }
        //TODO verificar a response.signature

        console.log("response")
        console.log(response)

        const signature_response = response.signature;
        const serverkey_encrypted = Buffer.from(response.serverkey);

        const serverkey = crypto.privateDecrypt(private_key, serverkey_encrypted).toString('hex');
        console.log("serverkey")
        console.log(serverkey.toString('hex'))

        const sessionkey = alice.computeSecret(serverkey.toString('hex'), 'hex', 'hex');
        console.log(sessionkey.toString('hex'))

        //return await response.json()
    }catch(error){
        console.log(error)
        return []
    }
}