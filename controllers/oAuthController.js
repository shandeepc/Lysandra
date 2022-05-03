const logger = require('../middleware/logger');
let config = require('../config/oAuthConfig.json');
let grants = require('../model/grants.json');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const OAuth2Server = require('@node-oauth/oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

function obtainToken(req, res) {
	var request = new Request(req);
	var response = new Response(res);
	return req.app.oauth.token(request, response)
		.then(function (token) {
			token.access_token = token.accessToken;
			if(token.refreshToken)
				token.refresh_token = token.refreshToken;
			res.json(token);
		}).catch(function (err) {
			logger.log(err, 'errorLog.txt');
			res.status(err.code || 500).json(err);
		});
}

var getAccessToken = function (token) {
	var tokens = grants.tokens.filter(function (savedToken) {
		return savedToken.accessToken === token;
	});
	if(tokens.length == 0) {
		return null;
	}
	tokens[0].accessTokenExpiresAt = new Date(tokens[0].accessTokenExpiresAt);
	return tokens[0];
};

var getClient = function (clientId, clientSecret) {
	var clients = config.clients.filter(function (client) {
		return client.clientId === clientId && client.clientSecret === clientSecret;
	});
	return clients[0];
};

var saveToken = function (token, client, user) {
	token.client = {
		id: client.clientId
	};

	token.user = {
		username: user.username
	};
	grants.tokens.push(token);
	updateData(grants);
	return token;
};

var getUser = function (username, password) {
	var users = config.users.filter(function (user) {
		return user.username === username && user.password === password;
	});
	return users[0];
};

var getUserFromClient = function (client) {
	var clients = config.clients.filter(function (savedClient) {
		return savedClient.clientId === client.clientId && savedClient.clientSecret === client.clientSecret;
	});
	return clients.length;
};

var getRefreshToken = function (refreshToken) {
	var tokens = grants.tokens.filter(function (savedToken) {
		return savedToken.refreshToken === refreshToken;
	});
	if (!tokens.length) {
		return;
	}
	tokens[0].refreshTokenExpiresAt = new Date(tokens[0].refreshTokenExpiresAt);
	return tokens[0];
};

var revokeToken = function (token) {
	grants.tokens = grants.tokens.filter(function (savedToken) {
		return savedToken.refreshToken !== token.refreshToken;
	});
	var revokedTokensFound = grants.tokens.filter(function (savedToken) {
		return savedToken.refreshToken === token.refreshToken;
	});
	return !revokedTokensFound.length;
};

function updateData(content) {
	try {
		fs.writeFileSync(path.join(__dirname, '..', 'model', 'grants.json'), JSON.stringify(content, null, 4));
		grants = content;
	} catch (error) {
		logger.log(`Caught Exception --> ${error}`, 'errorLog.txt');
	}
}

module.exports = {
	getAccessToken: getAccessToken,
	getClient: getClient,
	saveToken: saveToken,
	getUser: getUser,
	getUserFromClient: getUserFromClient,
	getRefreshToken: getRefreshToken,
	revokeToken: revokeToken,
	obtainToken: obtainToken,
	updateData: updateData
};