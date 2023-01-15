const logger = require('../middleware/logger');
const OAuth2Server = require('@node-oauth/oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
let grants = require('../model/grants.json');

const oAuthAuth = (req, res, next) => {
    var request = new Request(req);
    var response = new Response(res);
    return req.app.oauth.authenticate(request, response)
        .then(function (token) {
            next();
        }).catch(function (err) {
            logger.error(err);
            if(process.env.AUTH_TYPE.includes("Client Credentials") && err.message.endsWith("access token has expired") && JSON.parse(process.env.CLEAR_GRANTS_ON_EXPIRE.toLowerCase())) {
                var tokenToClear = req.headers.authorization.split(" ")[1];
                logger.debug(`Clearing token.. - ${tokenToClear}`);
                grants.tokens.splice(grants.tokens.indexOf(grants.tokens.find(t => t.accessToken === tokenToClear)),1);
                req.app.oauth.options.model.updateData(grants);
            }
            res.status(err.code || 500).json(err);
        });
}

module.exports = oAuthAuth;