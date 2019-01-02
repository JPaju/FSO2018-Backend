const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    passwordHash: {
        type:String,
        required: true
    },
    adult: {
        type:Boolean,
        default: true
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
    }]
})

userSchema.statics.format = function(user) {
    const formatteduser = { ...user._doc }
    delete formatteduser.__v
    delete formatteduser.passwordHash
    return formatteduser
}

const User = mongoose.model('User', userSchema)

module.exports = User
