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

      if(checkUserName(people, clean_name)){
        let randomNumber = Math.floor(Math.random() * 1001);
        let proposedName = clean_name + randomNumber;
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

checkUserName = (people, name) => {

  _.find(people, key => {
    console.log(people, key.name)
    if (key.name.toLowerCase() === name.toLowerCase()){
      return true;
    }else{
      return false;
    }

  });
}