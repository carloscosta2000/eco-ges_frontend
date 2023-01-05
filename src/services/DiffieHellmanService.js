

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
    verify.write(Buffer.from(response.encrypted_timestamp));
    verify.end();

    if(!verify.verify(server_public_key, Buffer.from(response.signature))){
        console.log("Signature not verified.")
        return;
    }
        
    const aliceKey = crypto.privateDecrypt(private_key, Buffer.from(response.encrypted_aliceKey));
    const alicePrime = crypto.privateDecrypt(private_key, Buffer.from(response.encrypted_alicePrime));
    const aliceGenerator = crypto.privateDecrypt(private_key, Buffer.from(response.encrypted_aliceGenerator));
    const timestamp = crypto.privateDecrypt(private_key, Buffer.from(response.encrypted_timestamp));
    
    console.log("start-diffie Values (Decrypted):");
    console.log("\t Alicekey: " + aliceKey.toString('hex'))
    console.log("\t AlicePrime: " + alicePrime.toString('hex'))
    console.log("\t AliceGenerator: " + aliceGenerator.toString('hex'))
    console.log("\t Timestamp: " + timestamp)


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

    const information_json = await fetch('end-diffie', requestOptions);
    let information = await information_json.json();
    
    const data_to_send = {
        morada: "",
        nif: "",
        iban: "",
        email: "",
        telefone: "",
    }

    if(information.morada)
        data_to_send["morada"] = await decypher_data(information.morada, 'hex', 'utf-8', secret)
    if(information.nif)
        data_to_send["nif"] = await decypher_data(information.nif, 'hex', 'utf-8', secret)
    if(information.iban)
        data_to_send["iban"] = await decypher_data(information.iban, 'hex', 'utf-8', secret)
    if(information.email)
        data_to_send["email"] = await decypher_data(information.email, 'hex', 'utf-8', secret)
    if(information.telefone)
        data_to_send["telefone"] = await decypher_data(information.telefone, 'hex', 'utf-8', secret)

    return {secret: secret.toString("hex"), information: data_to_send, timestamp: timestamp};
}

export async function save_data(token, sessionKey, morada, nif, iban, email, telefone){
    
    console.log("SessionKey");
    console.log(sessionKey)

    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            token: token,
            morada: await cypher_data(morada, 'utf-8', 'hex', sessionKey),
            nif: await cypher_data(nif, 'utf-8', 'hex', sessionKey),
            iban: await cypher_data(iban, 'utf-8', 'hex', sessionKey),
            email: await cypher_data(email, 'utf-8', 'hex', sessionKey),
            telefone: await cypher_data(telefone, 'utf-8', 'hex', sessionKey)
        })
    };


    const encrypted_morada = await cypher_data(morada, 'utf-8', 'hex', sessionKey);
    const decrypted_morada = await decypher_data(encrypted_morada, 'hex', 'utf-8', sessionKey);
    console.log(morada == decrypted_morada)
    console.log("encrypted_morada")
    console.log(encrypted_morada)
    console.log(morada + " " + decrypted_morada)



    const response_json = await fetch('save-information', requestOptions);
}


async function decypher_data(encrypted_data, inputEncoding, outputEncoding, secret_passed){
    const decipher = crypto.createDecipher("aes-256-cbc", secret_passed);
    let decrypted = decipher.update(encrypted_data, inputEncoding, outputEncoding);
    decrypted += decipher.final(outputEncoding);
    return decrypted;
}

async function cypher_data(data, inputEncoding, outputEncoding, secret_passed){
    const algorithm = 'aes-256-cbc';
    const cipher  = crypto.createCipher(algorithm, secret_passed);
    let encrypted = cipher.update(data, inputEncoding, outputEncoding);
    encrypted += cipher.final(outputEncoding);
    return encrypted;
}