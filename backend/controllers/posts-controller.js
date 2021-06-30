const Post = require('../model/post');

exports.createPost = (req, res, next) =>{
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title:  req.body.title, //function of body parser
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename, //the url path for image. file is a multer property
    creator: req.userData.userId,
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
    })
    .catch(error=>{
      res.status(500).json({
        message: "Failed to create post."
      })
    })
}

exports.fetchAllPosts = (req, res, next) => {
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
    })
    .catch(error=>{
      res.status(500).json({
        message: "Failed to fetch posts."
      })
    })
};

exports.fetchOnePost = (req, res, next)=>{
  Post.findById(req.params.id)
    .then(post =>{
      if(post){
        res.status(200).json(post);
      }else{
        res.status(404).json({
          message: "Post not found",
        });
      }
    })
    .catch(error=>{
      res.status(500).json({
        message: "Failed to fetch post."
      })
    })
};

exports.updatePost = (req, res, next) =>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post ({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  })
  Post.updateOne({_id : req.params.id, creator: req.userData.userId }, post)
    .then(result =>{
      //uses nModified -- print console.log(result) if unclear
      if(result.nModified > 0){
        res.status(200).json({
          message: "successful update",
        })
      } else{
        res.status(401).json({
          message: "The update is not successful",
        })
      }
    })
    .catch(error=>{
      res.status(500).json({
        message: "An error had occured! Post fails to update."
      })
    })
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result =>{
      //delete field uses n as it doesn't have nModified-- print console.log(result) if unclear
      if(result.n > 0){
        res.status(200).json({
          message: "Deleted",
        })
      } else{
        res.status(401).json({
          message: "The delete is not successful",
        })
      }
    })
    .catch(error=>{
      res.status(500).json({
        message: "Failed to delete post."
      })
    })
};
