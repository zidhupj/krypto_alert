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
