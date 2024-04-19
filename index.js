
import { Server } from "socket.io"
// const frontUrl = process.env.FRONT_URL
const io = new Server({ cors: "http://34.230.89.168:5173/" })
// const io = new Server({ cors: frontUrl })

let onlineUsers = []
io.on("connection", (socket) => {
  socket.on("addOnlineUser", (user)=>{ 
    if(!onlineUsers.some((user)=>user.socketId == socket.id)){
      onlineUsers.push({
        ...user,
        socketId: socket.id
    })
    }
    console.log(onlineUsers)
    let onlineUserNames = []
    onlineUsers.length > 0  && onlineUsers.map((user)=>{
      onlineUserNames.push(user?.name)
    })
    console.log(onlineUserNames)
    io.emit("getOnlineUsers", onlineUsers)
  })
  //add message
  socket.on("sendMessage", (message)=>{
    const recipient = onlineUsers.find(onlineUser => onlineUser._id == message.recipientId)
    console.log(message.text)
    if(recipient){
      io.to(recipient.socketId).emit("getMessage", message)
      // io.to(recipient.socketId).emit("getMessageNoti", message)
    }
  })
  socket.on("sendMatchNoti", (noti)=>{
    const recipient = onlineUsers.find(onlineUser => onlineUser._id == noti.recipientId)
    console.log(noti.text)
    if(recipient){
      io.to(recipient.socketId).emit("getMatchNoti", noti)
    }
  })
  socket.on("sendRemoveMatchNoti", (noti)=>{
    const recipient = onlineUsers.find(onlineUser => onlineUser._id == noti.recipientId)
    console.log(noti.text)
    if(recipient){
      io.to(recipient.socketId).emit("getRemoveMatchNoti", noti)
    }
  })
  socket.on("sendLikeNoti", (noti)=>{
    const recipient = onlineUsers.find(onlineUser => onlineUser._id == noti.recipientId)
    console.log(noti.text)
    if(recipient){
      io.to(recipient.socketId).emit("getLikeNoti", noti)
    }
  })
  socket.on("removeFan", (data)=>{
    const recipient = onlineUsers.find(onlineUser => onlineUser._id == data.noti.recipientId)
    if(recipient){
      io.to(recipient.socketId).emit("getRejectNoti", data.noti)
    }
  })
  socket.on("disconnect", ()=> {
    if(onlineUsers.some((user)=>user.socketId == socket.id)){
      onlineUsers = onlineUsers.filter((user)=>user.socketId !== socket.id)
            let onlineUserNames = []
        onlineUsers.map((user)=>{
          onlineUserNames.push(user.name)
        })
        console.log(onlineUserNames)
    }
    io.emit("getOnlineUsers", onlineUsers)
  })
});

io.listen(3000);