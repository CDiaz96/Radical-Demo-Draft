// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        organization : String
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);


// chat===========
// const users = [];
//
// // Join user to chat
// function userJoin(id, username, room) {
//   const user = { id, username, room };
//
//   users.push(user);
//
//   return user;
// }
//
// // Get current user
// function getCurrentUser(id) {
//   return users.find(user => user.id === id);
// }
//
// // User leaves chat
// function userLeave(id) {
//   const index = users.findIndex(user => user.id === id);
//
//   if (index !== -1) {
//     return users.splice(index, 1)[0];
//   }
// }
//
// // Get room users
// function getRoomUsers(room) {
//   return users.filter(user => user.room === room);
// }
//
// module.exports = {
//   userJoin,
//   getCurrentUser,
//   userLeave,
//   getRoomUsers
// };
