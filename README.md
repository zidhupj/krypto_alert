# krypto Alert Application

A rest API application that provides email alert service for a user to get triggered when the price of a cryptocurrency goes above users' target price.

# Steps to run the application

Step 1: Clone the repo locally and use pnpm install to download all dependencies.<br>
Step 2: Use docker compose up --build command to start the mysql and redis container.<br>
Step 3: Use the npm run build command to compile the typescript into javascript.<br>
Step 4: Use the npm start command to run the server.<br>


# API Docs

Base Url: localhost:3000/

### User Route
#### Endpoints
- POST<br>

-- /user/create : used to create a user.<br>
----------- Json example: {
    "email":"dummy@gmail.com",
    "password":"qqqqq"
}<br>
----------- Description: An accessToken is send bank in the cookies which can be used for futher actions.<br>

-- /user/login : used to login to a user account.<br>
----------- Json example: {
    "email":"dummy@gmail.com",
    "password":"qqqqq"
}<br>
----------- Description: An accessToken is send bank in the cookies which can be used for futher actions.<br>

### Alert Route
#### Endpoints
- POST<br>

-- /alert/create : used to create a alert for a specific user.<br>
----------- Important: Cookies section must contain the accessToken.<br>
----------- Json example: {
    "symbol":"btc",
    "price":"25000"
}<br>
- DELETE<br>

-- /alert/delete/:id : used to delete a certain alert<br>
----------- Important: Cookies section must contain the accessToken.<br>
----------- id: Unique id of the alert.
<br>
- GET<br>

-- /alert/all
----------- Important: Cookies section must contain the accessToken.<br>
----------- Three optional queries:<br>
---------------- status: "created" || "deleted" || "triggered"<br>
---------------- offset: Pagination parameter<br>
---------------- limit: Pagination parameter<br>


# Description

The projet uses nodes js as the backend and uses express to set yp a server. Further it uses axios to fetch cropto price data and uses Jsonwentokens for authentication. Argon2 was used to hash passwords.<br>
Redis was used in this project as a caching layer as well as message broker.<br>
Mysql is the main database used to store information in this project and Prisma was the ORM used to query the database.<br>

# DB Table structure
There were three main tables:
### User:
    -fields: email, password
### Coin:
    -fields: symbol
### Alert:
    -fields: id, price, status
#### User has many-to-one relation with Alert. A user can create many alerts.
#### Coin has many-to-one relation with Alert. Many alerts can be registered upon a coin.


