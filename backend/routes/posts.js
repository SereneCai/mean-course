const express = require ('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const PostController = require('../controllers/posts-controller');

//single refers to a single file
//execution happens from right to left, thus can pass in more than 1 paramemter to be checked
router.post("", checkAuth, PostController.createPost);

router.get('', PostController.fetchAllPosts);

router.get('/:id',PostController.fetchOnePost )

router.put('/:id', checkAuth, multer({storage: storage}).single("image"), PostController.updatePost);

router.delete('/:id',checkAuth, PostController.deletePost);

module.exports = router;



