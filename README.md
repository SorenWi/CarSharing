# Car Sharing - Softwaredesign

## How to run
* Clone repository
* Get node modules by using `npm install` in root folder
* Install MongoDB Version 5.0.9 from https://www.mongodb.com/try/download/community
* Create a database called `CarSharing`
* Run MongoDB on locally on port 27017 / (URI `mongodb://localhost:27017`)
* OPTIONAL: The data folder contains a cars.json file with 1000 example cars, this file can be imported into the database into the collection named "cars" (can be created manually if it doesn't already exist)
* Run `npm run server` or `node script/server.js` in root folder
    * The console should now display `Server running on http://localhost:3000` and `MongoDB connected`
* Go to `http://localhost:3000/` in any browser (Firefox was used for testing and development)

For running the application again only the last two steps are required

## Unit tests
* To run unit tests use `npm run test` in root folder
