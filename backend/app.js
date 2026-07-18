require('dotenv').config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);
const cors = require('cors');
const userModel = require('./models/user');
const chatModel = require('./models/chat');
const messageModel = require('./models/message');
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //Banana.png --> 20260717-5467Banana.png
    cb(null, file.originalname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const http = require('http');
const socket = require('socket.io');
const PORT = process.env.PORT

const server = http.createServer(app);

app.use(express.json());
const io = socket(server, {
    cors:{
        origin: "https://kalamchat.vercel.app",
        credentials: true
    }
});

app.use(cors({
    origin: "https://kalamchat.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

app.post('/uploads', upload.single("profilePicture"), async (req, res) => {
    console.log(req.file);
    let token = req.cookies.token
    console.log(token);
    let verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    let user = await userModel.findOne({email: verifiedToken.email});
    console.log("the profile user is: ",user);

    user.profilePic = req.file.filename;
    await user.save();

    res.json({
        message: "get user dettails!!!",
        success: true,
        user
    });
});

app.post('/logout', (req, res) => {
    let token = req.cookies.token
    res.clearCookie("token", {
            secure: true,
            httpOnly: true,
            sameSite: "none"
        }).json({
        message: "cookie cleared the token",
        success: true
    });
});

const onlineUsers = new Set()
io.on("connection", (socket) => {
    console.log("connected to socket");
   
    socket.on("join_room", (RoomID) => {
        console.log("THE ROOM ID IS: ",RoomID)
        socket.join(RoomID);
        console.log("Room Joined!!!");
    });

     socket.on("UserMessage", (data) => {
        const {Message, RoomID} = data
        console.log("THE MESSAGE IS: ",Message); //working!!!
        console.log("THE ROOMID IN CHAT SECTION IS: ",RoomID); //working!!!
        socket.to(RoomID).emit("Recieved_Message", {Message})
    });

    socket.on("Online_User", (data) => {
        socket.userId = data.userID
        console.log("recieved userID is: ",socket.userId);

         //Array --> [1, 1, 2, 2, 3,, 3 ,3 ] but set --> {"Amir", "Zuhaib"}
        onlineUsers.add(socket.userId)

        io.emit("onlineUsersArray",{
            users: [...onlineUsers]});
    })
    

    

socket.on("disconnect", () => {
    console.log("user disconnected from backend socket")
        if(socket.userId) {
        console.log("recieved userID is: ",socket.userId);
          
        onlineUsers.delete(socket.userId)

        io.emit("onlineUsersArray",{
            users: [...onlineUsers]});
    }

})
    
});



app.post('/', async (req, res) => {
    let {Username, Email, Password} = req.body;
    let userAlready = await userModel.findOne({email: Email});
    if(userAlready){
        console.log("already registered");
        return res.status(404).json({
            userAlready,
            message:"Already Registered Email!",
            success: false
        })
        console.log("already registered after");
    }
    let nameAlready = await userModel.find({
        username: Username
    });
    if(nameAlready.length > 0){
        console.log("name already taken")
        return res.status(401).json({
            msg: "Username already taken! Try different One",
            success: false,
            nameAlready
        })
    }

    let user;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(Password, salt, async (err, hash) => {
        
        user = await userModel.create({
        username: Username,
        email: Email,
        password: hash
    });
        console.log(user);
        let token = jwt.sign({email: Email, id: user._id}, process.env.JWT_SECRET);
        res.cookie("token", token, {
            secure: true,
            httpOnly: true,
            sameSite: "none"
        }).json({
            status: true,
            user
        })
        });
    });

});

app.get('/profile', async (req, res) => {
    let token = req.cookies.token
    console.log(token);
    let verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    let user = await userModel.findOne({email: verifiedToken.email});
    console.log("the found logged in user is here my brother: ",user);

    res.json({
        message: "log in successfully entered profile",
        success: true,
        user
    })
})

app.get('/search', async (req, res) => {
    try{
    let query = req.query.query
    console.log(query);
    let users = await userModel.find({
        username: {
            $regex: query,
            $options: "i"
        }
    });

    res.json({
        message: "successfully searched users!!!",
        success: true,
        users
    })} catch(err) {
        console.log("Not working backend!!");
        return res.status(401).json({
            success: false,
            message: "failed!"
        })
    }
});

app.get('/chat', async (req, res) => {
    let token = req.cookies.token
    let verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    let user = await userModel.findOne({email: verifiedToken.email});
    if(!user){
        return res.status(404).json({
            success:false
        })
    }
    res.json({
        message: "user logged in recieved",
        success: true,
        user
    })
});


app.get('/messages/:reciever', async (req, res) => {
    let token = req.cookies.token
    let verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    let reciever = req.params.reciever;
    let me = verifiedToken.id
    let messages = await messageModel.find({
        $or: [{
            sender: me,
            reciever: reciever
        },
    {
        sender: reciever,
        reciever: me
    }]
    }).sort({createdAt: 1});
    res.json(messages);
})

app.post('/chat', async (req, res) => {
    let {UserFoundID, Message} = req.body;
    console.log(Message);
    console.log(UserFoundID);
    let token = req.cookies.token;
    console.log(token)
    let verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    let user = await userModel.findOne({email: verifiedToken.email});
    console.log(user._id)

    if(!Message || !Message.trim()){
        return res.status(400).json({
            message:"empty message will not be accepted!!!",
            success: false
        });
    }
 
     const message = await messageModel.create({
        message: Message,
        sender: user._id,
        reciever: UserFoundID
    });
    console.log("message object is : ",message);
    
    user.messages.push(message._id);
    await user.save();
    
    

    res.json({
        message: 'Message recieved!!!',
        success: true,
        user,
        message
    })
});

app.post('/room', async (req, res) => {
    let {UserFoundID} = req.body
    console.log(UserFoundID);

     let token = req.cookies.token;
    console.log(token)
    let verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    let user = await userModel.findOne({email: verifiedToken.email});
    console.log(user._id);

    let chat;

    let chatFound = await chatModel.findOne({participants: {$all: [UserFoundID, user._id]}});
    console.log("THE ALREADY EXISTING FOUND CHAT IS: ",chatFound)

    console.log("THE FOUND USER IS: ",user);   

    
    if(chatFound){
        console.log("Before Chat Found")
        return res.json({
        message: 'Already Existing RoomID recieved!!!',
        success: true,
        roomIdFound: chatFound._id,
        user
    })
    }

    
     chat = await chatModel.create({
        participants: [UserFoundID, user._id]
    });
    console.log("THE CHAT IS HERE: ",chat);

     res.json({
        message: 'RoomID recieved!!!',
        success: true,
        user,
        chat
    })

})

app.post('/login', async (req, res) => {
    let{Email, Password} = req.body;
    console.log(Email);

    let user = await userModel.findOne({email: Email});
    console.log(user._id);

    bcrypt.compare(Password, user.password, (err, result) => {
        console.log("compare result: ", result);
        if(!result){
            return res.status(401).json({
                success:false
            });
        }
        let token = jwt.sign({email: Email, id: user._id}, process.env.JWT_SECRET);
        res.cookie("token", token, {
            secure: true,
            httpOnly: true,
            sameSite: "none"
        }).json({
        message: "logged in!",
        success: true,
        user
       });
    })
})

server.listen(PORT, () => {
    console.log("Listening on the port 3000...")
})