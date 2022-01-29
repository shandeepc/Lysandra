//authType can be   1. 'noAuth' - For no authentication
//                  2. 'basicAuthentication' - For username and password based authentication
//                  3. 'APIAuth' - permanent Token/Bearer based authentication
//                  4. 'JWT' - For JWT Token based authentication

const authType = 'noAuth';

module.exports.authType = authType;