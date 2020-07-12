const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Email address is not valid!')
        }
    }, 
    age: {
        type: Number,
        default: 0
    }, 
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) throw new Error('password must not contain the word password')
        }
    },
    tokens: [{
        type: String
    }]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'Owner'
})

userSchema.statics.findByCredentials = async (email, password) => {
    try {
        const user = await User.findOne({ email })

        if(!user) throw new Error('Login failed')

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) throw new Error('Login failed')

        return user
    }
    catch(e) {
        throw new Error('Login failed')
    }
}

userSchema.methods.toJSON = function() {
    const user = this

    const userObject = user.toObject()

    delete userObject.password

    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY)

    return token
}

userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({Owner: user._id})

    next()
})

const User = mongoose.model('Users', userSchema)

module.exports = User