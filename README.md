<br />
<div align="center">
  <a href="https://github.com/shandeepc/Lysandra">
    <img src="favicon.ico" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Lysandra</h3>
  <p align="center">
    Formally KiPerFiB REST API.
  </p>
</div>


# Lysandra

Version 4.0.1

## About The Project

A simple REST API built using Node.js and Express.js and few other magics.

Uses JSON files for persistance storage.

Primarily created to use as a Source/Target for IDAM Tools. But can be used for other things....

## Built With

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
* [@node-oauth/oauth2-server](https://www.npmjs.com/package/@node-oauth/oauth2-server)
* [body-parser](https://www.npmjs.com/package/body-parser)

# Recent Changes
* Added Seperate EndPoints for Adding and Removing group to/from employees(Check PostMan Collections)
* Added Seperate EndPoints for enabling and disabling employees(Check PostMan Collections)
* Added PATCH operation for Updating Employees(Check PostMan Collections)
* Added OAuth2.0 Client Credentials
* Added PostMan Collections with Examples

## Features
* Mutiple Schemas for managing(Employees & Groups)
* Support mutiple authentication methods
    * No Authentication
    * UserName and Password based authentication
    * Permanant API Token based authentication
    * JWT Token based authentication(Deprecated)
    * OAuth2.0(Client Credentials)
* Follows general public API standards
* Strict schema validation
* Supports pagging
* Supports password set and reset

## Getting Started

### Prerequisites

* Node.js(https://nodejs.org/)
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Download the lastest release
   
   https://github.com/shandeepc/Lysandra/releases
   
3. Install NPM packages
   ```sh
   npm install
   ```
4. Update Port number in `.env`(Optional)
   ```sh
   PORT = 6969
   ```
5.  Update secret in `.env`(Optional)
      
      Generate secrets by executing below command in Node console
      ```sh
         require('crypto').randomBytes(64).toString('hex')
      ```
      Copy the generated `SECRET` and place in `ACCESS_TOKEN_SECRET`
   
      Example :-
      ACCESS_TOKEN_SECRET=c11242e5719f3e42b46e50b7c13adcdb090bc148fdf94cd64418fc8d6e22e9ce09c58f5078b58bd6a6c52ed54ebb7c56ef93dd7fc9a7730420a0a24394322e6d
    
      Perform same above step again and place in `REFRESH_TOKEN_SECRET`
   
      Example :-
      REFRESH_TOKEN_SECRET=2d9c69c1caa4611ecdee16b03953d98c05e55e31bbca503aae4fda8b931360ae390db579f58539065d551869487cce5e272e9b757f7166e7fd9b16583f140898

### Usage

Start the application by either typing
   ```sh
   npm start
   ```
or
   ```sh
   node server
   ```

## Todo/Roadmap

- [x] Employees MVC
- [x] Basic Authentication
- [x] Simple API Authentication
- [x] Employees Password MVC
- [x] Groups MVC
- [x] JWT Authentication(Deprecated)
- [x] Fix IDAM warnings
- [x] Implement PATCH Operation
- [x] Add JWT Refresh via POST(Deprecated)
- [x] Implement OAuth(Sort Of)
- [x] Simulate OAuth2.0 Authentication mechanism
- [ ] Support sorting and filtering
- [ ] Fix cross auth bug(Secret..Sush)
- [ ] Add GUI
- [ ] Add Native app

## License

Distributed under the Proprietary License. See `LICENSE.txt` for more information.

## Contact

Shandeep - [@shandeepsrinivas](https://www.linkedin.com/in/shandeepsrinivas/) - [@_random_nerd](https://www.instagram.com/_random_nerd) - [www.shandeep.dev](https://www.shandeep.dev)