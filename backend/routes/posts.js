const express = require ('express');
const router = express.Router();
const Post = require('../model/post');

router.post('', (req, res, next) =>{
  const post = new Post({
    title:  req.body.title, //function of body parser
    content: req.body.content
  });
  post.save()
    .then((result)=>{
      res.status(201).json({
        message:"post added successfully",
        postId: result._id //returning this as part of the response
      })
    });
});

router.get('', (req, res, next) => {
  Post.find()
    .then((result)=>{
      //to get data of posts as json at the browser side
      res.status(200).json({
        message: 'Successful getting of data',
        posts: result
      })
    })

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

router.put('/:id', (req, res, next) =>{
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

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result =>{
      console.log(result);
      res.status(200).json({
        message: "Deleted"
      });
    })
});

module.exports = router;



