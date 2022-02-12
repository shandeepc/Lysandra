# KiPerFiB REST API
Kinda Perfect File Based REST API

A simple REST API built using Node.js and Express.js and few other magics.

Uses JSON files for persistance storage.

Primarily created to use as a Source/Target for IDAM Tools. But can be used for other things....

# Features

* Mutiple Objects for managing(Employees & Groups)
* Support mutiple authentication methods
* No Authentication
* UserName and Password based authentication
* Permanant API Token based authentication
* JWT Token based authentication(Refer Todo)
* Follows general public API standards
* Strict schema validation
* Supports pagging
* Supports password set and reset

# Todo

- [ ] Add JWT Refresh via POST
- [ ] Implement OAuth(Sort Of)
- [ ] Fix cross auth bug(Secret..Sush)
- [ ] Fix IDAM warnings
- [ ] Implement PATCH Operation

### Built With

* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com/)
* [Bcrypt](https://www.npmjs.com/package/bcrypt)
* [CORS](https://www.npmjs.com/package/cors)
* [Date-fns](https://www.npmjs.com/package/date-fns)
* [Dotenv](https://www.npmjs.com/package/dotenv)
* [Express-basic-auth](https://www.npmjs.com/package/express-basic-auth)
* [Joi](https://www.npmjs.com/package/joi)
* [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [Uuid](https://www.npmjs.com/package/uuid)
