let sanitize = require("validator");
let _ = require("underscore")._;
module.exports = io => {

  let people = {};
  let rooms = {};
  let sockets = [];
  let history = {};
let peerId;
  io.sockets.on("connection", socket => {
    socket.on('peerId', (id) => {
      peerId = id;
      socket.emit('update-people', people)
    })

    socket.on('send name', (data) => {
      let clean_name = decodeURI(sanitize.escape(data.name));
      let exists = false;
      _.find(people, key => {
        if (key.name.toLowerCase() === clean_name.toLowerCase())
          return (exists = true);
      });
      if(exists){
        do {
          proposedName = clean_name + randomNumber;
          //check if proposed username exists
          _.find(people, key => {
            if (key.name.toLowerCase() === proposedName.toLowerCase())
              return (exists = true);
          });
        } while (!exists);
        socket.emit("exists", {
          msg: "The username already exists, please pick another one.",
          proposedName: proposedName
        });
      }else{
        people[socket.id] = {
          name: clean_name,
          owns: null,
          inroom: null,
          device: data.device,
          peerId: peerId,
          color: getRandomColor(),
        };

        io.sockets.emit("update-people", people);
      }
    })
    socket.on('disconnect', () => {
      delete people[socket.id];
      io.sockets.emit("update-people", people);
    })

  })


}

getRandomColor = ranges => {
  if (!ranges) {
    ranges = [[150, 256], [0, 190], [0, 190]];
  }
  let g = function() {
    //select random range and remove
    let range = ranges.splice(Math.floor(Math.random() * ranges.length), 1)[0];
    //pick a random number from within the range
    return Math.floor(Math.random() * (range[1] - range[0])) + range[0];
  };
  color = "rgb(" + g() + "," + g() + "," + g() + ")";
  return color;
};