var nbgv = require('nerdbank-gitversioning')
nbgv.getVersion()
    .then(r => console.log(JSON.stringify(r)))
    .catch(e => console.error(e));