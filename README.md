# KiPerFiB REST API
Kinda Perfect File Based REST API

## About The Project

A simple REST API built using Node.js and Express.js and few other magics.

Uses JSON files for persistance storage.

Primarily created to use as a Source/Target for IDAM Tools. But can be used for other things....

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

## Features

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

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

* Node.js(https://nodejs.org/)
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/shandeepc/KiPerFiB-REST-API.git
   ```
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

## Usage

Start the application be either typing
   ```sh
   npm start
   ```
or
   ```sh
   node server
   ```

## Todo

- [ ] Add JWT Refresh via POST
- [ ] Implement OAuth(Sort Of)
- [ ] Fix cross auth bug(Secret..Sush)
- [ ] Fix IDAM warnings
- [ ] Implement PATCH Operation
