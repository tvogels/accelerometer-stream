
//  I M P O R T   L I B R A R I E S

var http = require('http')
  , socketio = require('socket.io')
  , fs = require('fs')
  , os = require('os')
  , path = require('path')
  , replacestream = require('replacestream');


// R E A D   S E R V E R   I P

var ifaces=os.networkInterfaces();
var ips = [];
for (var dev in ifaces) {
  var alias=0;
  ifaces[dev].forEach(function(details){
    if (details.family=='IPv4') {
      ips.push(details.address);
      ++alias;
    }
  });
}
var ip = ips.filter(function(d) {
  return d != '127.0.0.1';
})[0];


//  S E T   U P   T H E   H T T P   S E R V E R

function handler (req, res) {
  res.writeHead(200);
  var readStream = fs.createReadStream(path.join(__dirname, 'index.html'))
    .pipe(replacestream('<<IP>>', ip ))
    .pipe(res);
}
var app = http.createServer(handler);
var port = 8013;
app.listen(port);

console.info('To connect, open your mobile web browser and go to '+ip+':'+port+'. Make sure the computer and phone are connected to the same network');


//  S E T   U P   T H E   S O C K E T   C O N N E C T I O N

var io = socketio.listen(app);

// Make two lists of writable streams, one for the motions of all
// connected devices, and one for the orientations
var streams = {
  'motion': {},
  'orientation': {}
};

// getStream('faceup','motion') will return a write stream
// for the faceup-motion.txt file in the data directory.
// If stream is already open, add it to the global variable
// 'streams'. If not, create the stream and add it to the list.
var getStream = function (name, tp) {
  if (typeof streams[tp][name] !== 'undefined') {
    return streams[tp][name];
  } else {
    var stream = fs.createWriteStream(path.join('data',name+'-'+tp+'.txt'));
    streams[tp][name] = stream;
    return stream;
  }
};

// Code to handle incoming motion/orientation-events for the 
// phone in real-time.
io.sockets.on('connection', function (socket) {

  socket.on('motion', function (data) {
    var stream = getStream(data.sender,'motion');
    var a = data.acceleration;
    stream.write('' + a.x + ' ' + a.y + ' ' + a.z + "\n");
  });

  socket.on('orientation', function (data) {
    var stream = getStream(data.sender,'orientation');
    stream.write('' + data.alpha + ' ' + data.beta + ' ' + data.gamma +  "\n");
  });

});
