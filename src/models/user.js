const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true
    },
    passwordHash: String,
    adult: Boolean
})

userSchema.statics.format = function(user) {
    const formatteduser = { ...user._doc }
    delete formatteduser.__v
    delete formatteduser.passwordHash
    return formatteduser
}

const User = mongoose.model('User', userSchema)

module.exports = User
