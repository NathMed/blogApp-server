const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");
const { verify, verifyAdmin } = require("../auth");

// post
router.post("/addPost", verify, postController.addPost);
router.get("/getAllPost", postController.getAllPost);
router.get("/getMyOwnPost", verify, postController.getMyOwnPost);
router.get("/viewPost/:postId", postController.viewPost);

// comments
router.post('/:postId/comments', verify, postController.addComment);
router.get('/:postId/getComments', verify, postController.getComments);

router.patch('/:postId/upvote',   verify, postController.upvotePost);
router.patch('/:postId/downvote', verify, postController.downvotePost);

// edit
router.delete("/deletePost/:postId", verify, postController.deletePost);
router.patch('/:postId/flag', verify, postController.flagPost);
router.patch('/:postId/unflag', verify, verifyAdmin, postController.unflagPost);
router.patch("/editPost/:postId", verify, postController.editPost);

module.exports = router; 