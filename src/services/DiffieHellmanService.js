

import private_key_dir from '../keys/server.key';
//import public_key_dir from '../keys/public.key';
import server_public_key_dir from '../keys/backendpublic.key';
var crypto = require('crypto-browserify');

export async function diffie_hellman(token){
    
    const private_key = await (await fetch(private_key_dir)).text();
    //const public_key = await (await fetch(public_key_dir)).text();
    const server_public_key = await (await fetch(server_public_key_dir)).text();

    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
    const response_json = await fetch('start-diffie', requestOptions);
    const response = await response_json.json();
    
    console.log("\t start-diffie response received.");
    console.log(response)

    //TEST À ASSINATURA:
    const verify = crypto.createVerify('RSA-SHA256');
    verify.write(Buffer.from(response.encrypted_aliceKey));
    verify.write(Buffer.from(response.encrypted_alicePrime));
    verify.write(Buffer.from(response.encrypted_aliceGenerator));
    verify.end();

    if(!verify.verify(server_public_key, Buffer.from(response.signature))){
        console.log("Signature not verified.")
        return;
    }
        
    const aliceKey = crypto.privateDecrypt(private_key, Buffer.from(response.encrypted_aliceKey));
    const alicePrime = crypto.privateDecrypt(private_key, Buffer.from(response.encrypted_alicePrime));
    const aliceGenerator = crypto.privateDecrypt(private_key, Buffer.from(response.encrypted_aliceGenerator));
    
    console.log("start-diffie Values (Decrypted):");
    console.log("\t Alicekey: " + aliceKey.toString('hex'))
    console.log("\t AlicePrime: " + alicePrime.toString('hex'))
    console.log("\t AliceGenerator: " + aliceGenerator.toString('hex'))


    const bob = crypto.createDiffieHellman(alicePrime, aliceGenerator);
    const bobKey = bob.generateKeys();
    const secret = bob.computeSecret(aliceKey);

    console.log("end-diffie Values to be sent")
    console.log("\t AlicePrime: " + alicePrime.toString('hex'));
    console.log("\t AliceGenerator: " + aliceGenerator.toString('hex'));
    console.log("\n AliceKey: " + aliceKey.toString('hex'));
    console.log("\t BobKey: " + bobKey.toString('hex'));
    
    const encrypted_alicePrime = crypto.publicEncrypt(server_public_key, alicePrime);
    const encrypted_aliceGenerator = crypto.publicEncrypt(server_public_key, aliceGenerator);
    const encrypted_aliceKey = crypto.publicEncrypt(server_public_key, aliceKey);
    const encrypted_bobKey = crypto.publicEncrypt(server_public_key, bobKey);

    const sign = crypto.createSign('RSA-SHA256');
    sign.write(encrypted_alicePrime);
    sign.write(encrypted_aliceGenerator);
    sign.write(encrypted_aliceKey);
    sign.write(encrypted_bobKey);
    sign.end();
    const signature = await sign.sign(private_key);

    requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            token: token, 
            signature: signature, 
            encrypted_alicePrime: encrypted_alicePrime,
            encrypted_aliceGenerator: encrypted_aliceGenerator,
            encrypted_aliceKey: encrypted_aliceKey,
            encrypted_bobKey: encrypted_bobKey
        })
    };
    console.log("\t end-diffie response received.");
    fetch('end-diffie', requestOptions);

    console.log("\t\t Secret")
    console.log(secret.toString("hex"))
    return secret.toString("hex");
<<<<<<< HEAD
}

export async function save_data(token, morada, nif, iban, email, telefone){
    
    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            morada: morada,
            nif: nif,
            iban: iban,
            email: email,
            telefone: telefone
        })
    };
    const response_json = await fetch('save-information', requestOptions);
=======
>>>>>>> bb36aad2f16d8fd77e118fc67e96514447da2cef
}