const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { createAccessToken, errorHandler } = require("../auth");

// register
module.exports.registerUser = (req, res) => {

    if (req.body.password.length < 8) {
        return res.status(400).send({ error: 'Your spell code must be at least 8 characters!' });
    }

    if (!req.body.email.includes("@")){
        return res.status(400).send({ error: 'Invalid Adventurer Email format.' });
    } else {
    	return User.find({ email : req.body.email })
    	.then(result => {

            if (result.length > 0) {
                return res.status(409).send({ message: "Adventurer email is already claimed!" });
            } else {

            	let newUser = new User({
            	    firstName : req.body.firstName,
            	    lastName : req.body.lastName,
            	    email : req.body.email,
            	    password : bcrypt.hashSync(req.body.password, 10)
            	});

            	return newUser.save()

            	.then((result) => res.status(201).send({
            	    message: 'Registered complete! Welcome to the Guild.',
            	}))
            	.catch(err => errorHandler(err, req, res));
            };
        })

        .catch(err => errorHandler(err, req, res));
    }
}

// login
module.exports.loginUser = (req, res) => {
	if (!req.body.email.includes("@")){
        return res.status(400).send({ error: 'Invalid Adventurer Email format.' });
    }

    return User.findOne({email: req.body.email})
    .then(user => {
    	if (!user) {
    		return res.status(401).send({
    			error: "Adventurer profile not found."
    		})
    	}

    	const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

    	if (!isPasswordCorrect) {
    		return res.status(401).send({
    			error: "Wrong credentials! The monster bit you."
    		})
    	}

    	return res.status(200).send({
    		access: createAccessToken(user),
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
    	})
    })
    .catch(err => errorHandler(err, req, res));
}

// get user details
module.exports.getProfile = (req, res) => {

    return User.findById(req.user.id)
    .then(user => {

        if (!user) {
            return res.status(404).send({ error: "Target not found!" });
        }

        user.password = "";

        return res.status(200).send({
            user: user
        });

    })
    .catch(err => errorHandler(err, req, res));
};

// get all user
module.exports.getAllUser = (req, res) => {
    return User.find()
    .then(user => {
        if (!user) {
            return res.status(404).send({ error: "Guild is empty!" });
        }

        return res.status(200).send({users: user})
    })
    .catch(err => errorHandler(err, req, res));
}