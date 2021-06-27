const express = require ('express');
const router = express.Router();
const Post = require('../model/post');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP ={
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}
const storage = multer.diskStorage({
  //destination -- a function that will be executed when try to save a file
  destination: (req, file, cb) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype]; //checking for validity of the file type
    let error = new Error("Invalid image type"); //mimetype is a multer function
    if(isValid){
      error = null;
    }
    cb(error, "backend/images"); //1st paramemter passes an error, the 2nd is the destination
  },
  filename: (req, file, cb)=>{
    const name= file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype]; //to select a mime type from the map
    cb(null, name + '-' + Date.now() + '.' + ext); //constructing name of the file
  }
  //cb = callback
});

//single refers to a single file
//execution happens from right to left, thus can pass in more than 1 paramemter to be checked
router.post("", checkAuth, multer({storage: storage}).single("image"), (req, res, next) =>{
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title:  req.body.title, //function of body parser
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename, //the url path for image. file is a multer property
  });
  post.save()
    .then((result)=>{
      res.status(201).json({
        message:"post added successfully",
       post:{ //can use ...result to auto populate with id: result._id to set id
          id: result._id,
          title: result.title,
          content: result.content,
          imagePath: result.imagePath,
       }
      })
    });
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize; //anything from url is a string, and limit() only works with numbers
  const currentPage = +req.query.page; //adding a + in front changes them to number
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage - 1)) //will not retrieve all data. the formula is for skipping items from previus page
      .limit(pageSize); // limit how many items it returns
      //still execute query on all elements of db
      //this could be inefficient if the the db is huge
    //will reflect in localhost:3000/api/posts with query parameters
  }
  postQuery
    .then((result)=>{
      fetchedPosts = result;
      //to get data of posts as json at the browser side
      return Post.count();
      })
    .then(count =>{
      res.status(200).json({
        message: 'Successful getting of data',
        posts: fetchedPosts,
        maxPosts: count //the number of total post in db
      });
    });
});

router.get('/:id', (req, res, next)=>{
  Post.findById(req.params.id)
    .then(post =>{
      if(post){
        res.status(200).json(post);
      }else{
        res.status(404).json({
          message: "not found",
        });
      }
    })
})

router.put('/:id', checkAuth, multer({storage: storage}).single("image"), (req, res, next) =>{
  const post = new Post ({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  })
  Post.updateOne({_id : req.params.id}, post)
    .then(result =>{
      console.log(result);
      res.status(200).json({
        message: "successful update",
      })
    })
});

router.delete('/:id',checkAuth, (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result =>{
      console.log(result);
      res.status(200).json({
        message: "Deleted"
      });
    })
});

module.exports = router;



