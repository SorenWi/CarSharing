# Car Sharing - Softwaredesign

## How to run (first time)
* Clone repository
* Install Node.js if not already installed https://nodejs.org/en/
* Get node modules by using `npm install` in root folder
* Install MongoDB Version 5.0.9 from https://www.mongodb.com/try/download/community
* Run MongoDB on locally on port 27017 (URI `mongodb://localhost:27017`)
   * OPTIONAL: The data folder contains a cars.json file with 1000 example cars, this file can be imported into the database "CarSharing" into the collection named "cars" (database and collection are created automatically after executing the next step successfully once, but can be created manually before that)
* Run `npm run server` or `node script/server.js` in root folder
    * The console should now display `Server running on http://localhost:3000` and `MongoDB connected`
* Go to `http://localhost:3000/` in any browser (Firefox was used for testing and development)

Hardcoded admin account: Username: admin, Password: admin

## How to run (second+ time)
* Run MongoDB on locally on port 27017 / (URI `mongodb://localhost:27017`)
* Run `npm run server` or `node script/server.js` in root folder
    * The console should now display `Server running on http://localhost:3000` and `MongoDB connected`
* Go to `http://localhost:3000/` in any browser (Firefox was used for testing and development)

## Unit tests
* To run unit tests use `npm run test` in root folder
