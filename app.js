var express = require('express');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const fileUpload = require('express-fileupload');
const fs = require('fs');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const mongoose = require('mongoose');


mongoose.connect('Buraya Mongodb Atastan aldığınız keyi giriniz', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const uploadDir = 'public/uploads';
    
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
} 


//const path = require('path');
const port = 5000;

const ejs = require('ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

app.set("view engine", "ejs");

app.get('/', async (req, res) => {
    const posts = await Post.find({}); // asenkron olarak fotoğrafları ve yorumları
    const comments = await Comment.find({}); //yakaladık.
    res.render('index', {posts: posts, comments: comments}); //anasayfamızda yazdırdık
});
  
app.get("/addPost", (req, res) => {
    res.render('addPost');
});


app.post('/posts', async (req, res) => {
    await Post.create(req.body);
    let uploadedImage = req.files.image;
    let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

    uploadedImage.mv(uploadPath);

    
    const filter = {title: req.body.title}
    const update = {image: uploadedImage.name}
    
    let post = await Post.findOneAndUpdate(filter, update);

    res.redirect('/');
});

app.post('/deletePost/:id', async(req, res) => {
    let id = req.params.id;
    console.log(id);
    Post.findByIdAndDelete(id, (err, data) => {
        console.log('Post Silindi.');
    });

    const filter = {postId: id}
    await Comment.findOneAndDelete(filter);
    res.redirect('/');
});

app.post('/newComment/:id', async (req,res) =>{
    await Comment.create({postId: req.params.id, text: req.body.text, name: req.body.name});
    res.redirect('/');
});



io.on('connection', function(socket) {
    console.log('A user connected');
 
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });
 });

/*
app.get('/posts/:id', async (req, res) =>{
    //console.log(req.params.id);
    const post = await Post.findById(req.params.id);
    //console.log(post)
    res.render('post', { post: post });
});
*/

http.listen(port, function() {
    console.log('Sunucu ${port} üstünde çalışıyor', port)
});
