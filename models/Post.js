const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User ID is Required'],
		index: true
	},
	author: {
        type: String,
        required: [true, 'Authors is required']
    },
	headline: {
		type: String,
		required: [true, 'Headline is Required']
	},
	introduction: {
		type: String,
		required: [true, 'Introduction is Required']
	},
	mainContent: {
		type: String,
		required: [true, 'Main Content is Required']
	},
	date: {
		type: Date,
		default: Date.now
	},
	comments: [{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is Required'],
            index: true
		},
		commenter: {
            type: String,
            required: [true, 'Commenter Name is required']
        },
		comment: {
			type: String,
			required: [true, "Comment is Required"]
		},
		date: {
            type: Date,
            default: Date.now
        }
	}],
	upvotedBy: [{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotedBy: [{
    	type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    flagged: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('Post', postSchema)