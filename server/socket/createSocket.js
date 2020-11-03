const createSocket = function(server){
  
  const io = require('socket.io')(server,{
    path:'/signal'
  });
  io.on('connection', clientSocket => {
    let roomNumberMap = {}; //房间人数
    let curRoomName = '';
    //加入房间
    clientSocket.on("joinroom",function (args) {
      const data = JSON.parse(args||"{}")
      //暂时做成以最后一个房间号为准
      curRoomName = data.roomName;
      if(roomNumberMap[curRoomName]>=2){
        //一个房间只有能有两个人
        console.log('one room 2 persons at most')
        return; 
      } 
      //join(房间名)加入房间
      clientSocket.join(curRoomName); 
      io.to(curRoomName).emit('user-joined',data.userId);
      roomNumberMap[curRoomName]? ++roomNumberMap[curRoomName] : roomNumberMap[curRoomName] = 1;
    });
    //退出 离开房间
    clientSocket.on("leaveRoom",function (roomName) {
        //leave(房间名) 离开房间
        clientSocket.leave(roomName);
    });
    clientSocket.on('broadcast', params => {
      //发送给该房间其他人（除了发送者）
      clientSocket.to(curRoomName).emit('broadcast',params)
    });
    clientSocket.on('disconnect', () => { /* … */ });
  });
}

module.exports = createSocket
