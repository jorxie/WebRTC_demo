const createSocket = function(server){
  
  const io = require('socket.io')(server,{
    path:'/signal'
  });
  io.on('connection', clientSocket => {
    let roomNumberMap = {}; //room counts
    let curRoomName = '';
    //join room
    clientSocket.on("joinroom",function (args) {
      const data = JSON.parse(args||"{}")
      curRoomName = data.roomName;
      if(roomNumberMap[curRoomName]>=2){
        console.log('one room 2 persons at most');
        return; 
      } 
      clientSocket.join(curRoomName); 
      io.to(curRoomName).emit('user-joined',data.userId);
      roomNumberMap[curRoomName]? ++roomNumberMap[curRoomName] : roomNumberMap[curRoomName] = 1;
    });
    clientSocket.on("leaveRoom",function (roomName) {
        clientSocket.leave(roomName);
    });
    clientSocket.on('broadcast', params => {
      //send message to the peer in the room exclude the sender
      clientSocket.to(curRoomName).emit('broadcast',params);
    });
    clientSocket.on('disconnect', () => { /* … */ });
  });
}

module.exports = createSocket
