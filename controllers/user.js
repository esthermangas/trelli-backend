const User = require('../models/user');

//GET ALL
exports.index = async function (req, res) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (e){
        res.status(500).json({message: e.message});
    }
};

//GET ONE
exports.getOne = async function (req, res) {
    res.status(200).json(req.user);
};

//POST
exports.createOne = async function (req, res) {
    try {
        const user = await User.findOne({email: req.body.email});

        if (user) {
            res.status(401).json({error: {email: 'The email is already registered.'}});
        }else {
            const newUser = new User(req.body);
            try {
                newUser.save();
                res.status(201).json(newUser);
            }catch (e) {
                res.status(500).json({message: e.message});
            }
        }
    }catch (e) {
        res.status(500).json({message: e.message});
    }

};

//PATCH
exports.updateOne = async function (req, res) {
    if(String(req.authUser._id) !== String(req.user._id)) {
        res.status(403).json({message: "This is not your user."})
    }else {
        Object.entries(req.body).forEach(([key, value]) =>{
            if(req.user[key]){
                req.user[key] = value;
            }
        });

        try{
            const updatedUser = await req.user.save();
            res.status(200).json(updatedUser)
        }catch (e) {
            res.status(500).json({message: e.message});
        };
    }
};


//DELETE
exports.deleteOne = async function (req, res) {
    if(String(req.authUser._id) !== String(req.user._id)) {
        res.status(403).json({message: "You are not this user."})
    }else {
        try{
            await req.user.remove();
            res.status(200).json({message: "Your user has been deleted."});
        }catch (e) {
            res.status(500).json({message: e.message});
        }
    }
};


//MIDDLEWARE
exports.getUser = async function (req, res, next) {
    try{
        user = await User.findOne({_id: req.params.id});
        if(user == null) {
            return res.status(404).json({message: "User not found"});
        }
    }catch (e) {
        res.status(500).json({message: e.message});
    }
    req.user = user;
    next();
};