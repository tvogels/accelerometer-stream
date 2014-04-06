# Phone Motion Stream Server

This is a simple node.js server that sets up a real-time stream between a mobile phone's accelerometer and gyroscope data to the server. The phone connects through its browser, after which the data is transfered over a websocket connection.


## Installation

Make sure you have the following

* [node.js](http://nodejs.org/) installed 
* This project in a folder on your PC or Mac. (Download using the [Download ZIP] button on the right of this page.)

## Usage

### Start the server

* Open a console (Terminal in OS X, cmd in Windows)
* Navigate to the server directory (using `cd`). The server directory is the folder downloaded from here and includes the `server.js` file.
* Start the server by typing `node server.js`.

### Set up the connection

* Grab your phone and navigate to the webpage indicated by the server when started.
* Enter a unique ID for the measurement and start streaming!
* The data collected will end up in data/[id]-(motion|orientation).txt