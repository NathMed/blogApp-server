const Post = require('../models/Post')
const User = require('../models/User')
const { errorHandler } = require("../auth");

// Add Post
module.exports.addPost = async (req, res) => {
	try {
        const newPost = new Post({
            userId: req.user.id,
            author: req.user.firstName + ' ' + req.user.lastName,
            headline: req.body.headline,
            introduction: req.body.introduction,
            mainContent: req.body.mainContent,
        })

        const savedPost = await newPost.save()
        const postCount = await Post.countDocuments({ userId: req.user.id });
        const XP_PerPost = 1000;
        const XP_NeedToLevel = 1500;
        const newLevel = Math.floor((postCount * XP_PerPost) / XP_NeedToLevel) + 1;

        await User.findByIdAndUpdate(req.user.id, { level: newLevel });

        return res.status(201).send({ 
            message: 'New Quest posted to the Guild Board!', 
            post: savedPost }); 
    } catch (err) {
        return errorHandler(err, req, res);
    }
}

// Get all posts
module.exports.getAllPost = (req, res) => {
	return Post.find({})
    .populate('userId', 'firstName lastName level')
    .sort({ date: -1 })
	.then(posts => {
		return res.status(200).send({posts})
	})
	.catch(err => errorHandler(err, req, res));
}

// view user own posts
module.exports.getMyOwnPost = (req, res) => {
	return Post.find({userId: req.user.id}).sort({ date: -1 })
	.then(posts => {
		return res.status(200).send({posts})
	})
	.catch(err => errorHandler(err, req, res));
}

// view specific post by id
module.exports.viewPost = (req, res) => {
	return Post.findById(req.params.postId)
	.then(post => {
		if (!post) {
			return res.status(404).send({message: 'Quest not found!'})
		} else {
			return res.status(200).send(post)
		}
	})
	.catch(err => errorHandler(err, req, res));
}

// vote button 
module.exports.upvotePost = (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;

    return Post.findById(postId)
    .then(post => {

        if (!post) {
            return res.status(404).send({ message: 'Quest not found!' });
        }

        const alreadyUpvoted = post.upvotedBy.includes(userId);

        if (alreadyUpvoted) {
            return Post.findByIdAndUpdate(
                postId,
                { $pull: { upvotedBy: userId } },
                { new: true }
            )
            .then(updatedPost => {
                return res.status(200).send({
                    message: 'Party buff canceled. Post lost 1 HP.',
                    upvotes: updatedPost.upvotedBy.length,
                    downvotes: updatedPost.downvotedBy.length
                });
            });

        } else {

            return Post.findByIdAndUpdate(
                postId,
                {
                    $addToSet: { upvotedBy: userId },
                    $pull: { downvotedBy: userId }
                },
                { new: true }
            )
            .then(updatedPost => {
                return res.status(200).send({
                    message: 'Critical Hit! You cheered the party.',
                    upvotes: updatedPost.upvotedBy.length,
                    downvotes: updatedPost.downvotedBy.length
                });
            });
        }

    })
    .catch(err => errorHandler(err, req, res));
}


module.exports.downvotePost = (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;

    return Post.findById(postId)
    .then(post => {

        if (!post) {
            return res.status(404).send({ message: 'Quest not found!' });
        }

        const alreadyDownvoted = post.downvotedBy.includes(userId);

        if (alreadyDownvoted) {
            return Post.findByIdAndUpdate(
                postId,
                { $pull: { downvotedBy: userId } },
                { new: true }
            )
            .then(updatedPost => {
                return res.status(200).send({
                    message: 'Debuff lifted! Quest recovered.',
                    upvotes: updatedPost.upvotedBy.length,
                    downvotes: updatedPost.downvotedBy.length
                });
            });

        } else {

            return Post.findByIdAndUpdate(
                postId,
                {
                    $addToSet: { downvotedBy: userId },
                    $pull: { upvotedBy: userId }
                },
                { new: true }
            )
            .then(updatedPost => {
                return res.status(200).send({
                    message: 'Debuff applied! Post lost 1 HP.',
                    upvotes: updatedPost.upvotedBy.length,
                    downvotes: updatedPost.downvotedBy.length
                });
            });
        }

    })
    .catch(err => errorHandler(err, req, res));
}

// add comment using id
module.exports.addComment = (req, res) => {
	return Post.findByIdAndUpdate(
		req.params.postId,
		{
			$push: {
				comments: {	
					userId: req.user.id,
					commenter: req.user.firstName + ' ' + req.user.lastName,
                    comment: req.body.comment
				}
			}
		}, {new: true})

	.then(result => {
		if (!result) return res.status(404).send({ message: 'Post not found.' });

		return res.status(200).send({
			message: 'Party chat updated successfully!',
			updatedPost: result
		})
	})
	.catch(err => errorHandler(err, req, res))
}

// Get comments using post ID
module.exports.getComments = (req, res) => {
	return Post.findById(req.params.postId)

	.populate('comments.userId', 'firstName lastName') 

	.then(post => {
		if (!post) {
			return res.status(404).send({error: 'Post not found.'})
		}
		return res.status(200).send({comments: post.comments})
	})
	.catch(err => errorHandler(err, req, res))
}

// delete post
module.exports.deletePost = (req, res) => {
    return Post.findById(req.params.postId)

	.then(post => {
        if (!post) return res.status(404).send({ message: 'Quest not found!' });
        if (post.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).send({ message: 'You may only delete your own quests!' });
        }

        return Post.findByIdAndDelete(req.params.postId)
    })
    .then(result => {
        if (!result) return;
        return res.status(200).send({ message: 'Quest abandoned and removed!' });
    })
    .catch(err => errorHandler(err, req, res));
}

// admin cannot delete anything except flagged post
module.exports.flagPost = (req, res) => {
    return Post.findByIdAndUpdate(
        req.params.postId,
        { flagged: true },
        { new: true }
    )
    .then(post => {
        if (!post) return res.status(404).send({ message: 'Quest not found!' });
        return res.status(200).send({ message: 'Reported to the Guild Master!' });
    })
    .catch(err => errorHandler(err, req, res));
}

module.exports.unflagPost = (req, res) => {
    return Post.findByIdAndUpdate(
        req.params.postId,
        { flagged: false },
        { new: true }
    )
    .then(post => {
        if (!post) return res.status(404).send({ message: 'Quest not found!' });
        return res.status(200).send({ message: 'Approved by the Guild Master!' });
    })
    .catch(err => errorHandler(err, req, res));
}

// update a post (owner only)
module.exports.editPost = (req, res) => {
    return Post.findById(req.params.postId)
    .then(post => {
        if (!post) {
            return res.status(404).send({ message: 'Quest not found!' });
        }

        if (post.userId.toString() !== req.user.id) {
            return res.status(403).send({ message: 'You may only edit your own quests!' });
        }
 
        const { headline, introduction, mainContent } = req.body;

        if (headline !== undefined) post.headline = headline;
        if (introduction !== undefined) post.introduction = introduction;
        if (mainContent !== undefined) post.mainContent = mainContent;

        return post.save();
    })
    .then(updatedPost => {
        if (!updatedPost) return;
        return res.status(200).send({ message: 'Quest updated successfully!', post: updatedPost });
    })
    .catch(err => errorHandler(err, req, res));
}