const createSocket = function(server){
  
  const io = require('socket.io')(server,{
    path:'/signal'
  });
  io.on('connection', clientSocket => {
    let roomNumberMap = {}; //房间人数
    //加入房间
    clientSocket.on("joinroom",function (args) {
      const data = JSON.parse(args||"{}")
      if(roomNumberMap[data.roomName]>=2) return; //一个房间只有能有两个人
      clientSocket.join(data.roomName); // join(房间名)加入房间
      io.to(data.roomName).emit('user-joined',data.userId);
      roomNumberMap[data.roomName]? ++roomNumberMap[data.roomName] : roomNumberMap[data.roomName] = 1;
    });
    //退出 离开房间
    clientSocket.on("leaveRoom",function (roomName) {
        clientSocket.leave(roomName);//leave(房间名) 离开房间
    });
    clientSocket.on('broadcast', params => {
      //发送给该房间其他人（除了发送者）
      clientSocket.io(data.roomName).emit('broadcast',params)
    });
    clientSocket.on('disconnect', () => { /* … */ });
  });
}

module.exports = createSocket
