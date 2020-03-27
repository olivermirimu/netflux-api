## netflux-api
This is the api to e deployed togeter with the netflux web app

## Setting up the API

Default port = 3500

1) The previous run of te npm install should have installed the packages required to run the api.

You will need to set up mongodb(mongolink) on your device to run the following then follow the steps outlined below.

Run the following commands in your command line.
<!-- TODO -->
1) mongo movieApi < api/moviesJson.js <!-- This will create the movieAPI database and create the movie list within a collection called movies-->
2) mongo movieApi < api/usersJson.js <!-- This will create a collection called users that will store your users-->
