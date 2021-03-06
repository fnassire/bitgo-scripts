require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const walletPassphrase = process.env.BITGO_PASSPHRASE;
// const fee = 10000;

const params = {
    recipients: [
        {
            amount: 3000000,
            address: "2NAttnCeZFoRLhSkirg7NjuVJZ4hSE6m8YN"
        }
    ]
};

// transaction size of in x 180 + out x + 10 plus or minus in

bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    wallet.getEncryptedUserKeychain({}, function(err, keychain) {
        if (err) {
            console.log('Error getting encrypted keychain!');
            console.dir(err);
            return process.exit(-1);
        }
        console.log('Got encrypted user keychain');

        keychain.xprv = bitgo.decrypt({ password: walletPassphrase, input: keychain.encryptedPrv });
        wallet.prebuildTransaction(params).then(function (transaction) {
            // print transaction details
            // TODO: Write code to estimate fee
            var params3 = {
                "txPrebuild": {
                    "txHex": transaction.txHex,
                    "txInfo": {
                        "nP2SHInputs": 1,
                        "nSegwitInputs": 0,
                        "nOutputs": 2,
                        "unspents": [
                            {
                                "chain": 0,
                                "index": 63,
                                "redeemScript": '5221024107ee4410dc2dd14b16550fb80a3697046531cb28f55bed740ccb99d6589a0321022e6c4bed41f03b9d4cbf616d4aaec1908d63e6e88676dbbed351718b5171252f21032ba1aeeef48dd4b50d86371321aa4deedc514ac50316c84c73da1a191713fb2b53ae',
                                "id": 'cfed2842ae3038031773feee6f6d41598de5cc34c15335bd3daad422d3e49c82:1',
                                "address": '2N3hqBWVNSFgS9uav2Qjh97eSWrUZJU7Z3h',
                                "value": 45267200,
                                "isSegwit": false
                            }
                        ],
                        "changeAddress": "2NAttnCeZFoRLhSkirg7NjuVJZ4hSE6m8YN",
                        "changeAddresses": ["2NAttnCeZFoRLhSkirg7NjuVJZ4hSE6m8YN"]
                    },
                    "feeInfo": {
                        "size": 218,
                        "fee": 654,
                        "feeRate": 3000,
                        "payGoFee": 0,
                        "payGoFeeString": "0"
                    }
                },
                "prv": keychain.xprv
            };
            // console.dir(transaction);
            wallet.signTransaction(params3, function (err, transaction) {
                if (err) {
                    console.log('Failed to sign transaction!');
                    console.dir(err);
                    return process.exit(-1);
                }
                const params2 = {
                    txHex: transaction.txHex
                };
                wallet.submitTransaction(params2).then(function (transaction) {
                    console.dir(transaction);
                });
                console.dir(transaction);
            });
        });
    });
});

/*
Got encrypted user keychain
{ txHex: '0100000001cafa7e0c0a3e86fd402e7a63d1b92f8faf66da8f45561abd37d288c6da280a0201000000b600473044022074cddd1e151002335c7e0ab16be85decf65f564bdc631fd2676c78b9c2ada75b02205d121060f83ed0c15a60048d607fcd308c96a04c5427e4b216232985136ff74c0100004c6952210263fbb9074fab4d61d33953c3f930a87a4e0ff3aa8f58a8a93c002183c35c77e821031bdc694faba0fd2a86bb0c7651c9b2e40be8677ab32421c2ee049b61100f333221033c85066e5656d89b5cdb2fc7ea7b327b3da42bd253e0346e2524f4051892660753aeffffffff02a08601000000000017a914c199e91b9e28022b8cc3170824525be04fa4d1278712c24a000000000017a914050a48738f40a56c9142542af8581941b035fc68872f341400' }
Unhandled rejection Error: Expected Buffer, got undefined requestId=cji3jnv73678kq3ru8shpslbc
    at errFromResponse (/Users/danielbruce/Documents/Programming/alchemy-website/node_modules/bitgo/src/bitgo.js:84:15)
    at handleResponseError (/Users/danielbruce/Documents/Programming/alchemy-website/node_modules/bitgo/src/bitgo.js:101:11)
From previous event:
    at Request.req.then (/Users/danielbruce/Documents/Programming/alchemy-website/node_modules/bitgo/src/bitgo.js:389:40)
    at Request.superagent.Request.result (/Users/danielbruce/Documents/Programming/alchemy-website/node_modules/bitgo/src/bitgo.js:70:15)
    at Wallet.submitTransaction (/Users/danielbruce/Documents/Programming/alchemy-website/node_modules/bitgo/src/v2/wallet.js:946:4)
    at /Users/danielbruce/Documents/Programming/alchemy-website/test/script-bitgo-build-and-send-transaction.js:73:24
    at runCallback (timers.js:785:20)
    at tryOnImmediate (timers.js:747:5)
    at processImmediate [as _immediateCallback] (timers.js:718:5)
 */