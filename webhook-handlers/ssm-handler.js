const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1" });
const SSM = require('aws-sdk/clients/ssm');
const ssm = new SSM()

module.exports = (async function () {
    const appIdOptions = {
        Name: 'APPID', /* required */
        WithDecryption: true
    };
    const appIdPromise = ssm.getParameter(appIdOptions).promise();
    const appIdData = appIdPromise.then(function (data, err) {
        if (err) console.log(err, err.stack); // an error occurred        
        return parseInt(data.Parameter.Value)           // successful response
    })
    const privateKeyOptions = {
        Name: 'PRIVATEKEY', /* required */
        WithDecryption: true
    };
    const privateKeyPromise = ssm.getParameter(privateKeyOptions).promise();
    const privateKeyData = privateKeyPromise.then(function (data, err) {
        if (err) console.log(err, err.stack); // an error occurred    
        return data.Parameter.Value           // successful response
    })
    const personalAccessTokenOptions = {
        Name: 'PERSONALACCESSTOKEN',
        WithDecryption: true
    };
    const personalAccessTokenPromise = ssm.getParameter(personalAccessTokenOptions).promise();
    const personalAccessTokenData = personalAccessTokenPromise.then(function (data, err) {
        if (err) console.log(err, err.stack); // an error occurred
        return data.Parameter.Value           // successful response
    })

    return await { appIdData, privateKeyData, personalAccessTokenData }
})();