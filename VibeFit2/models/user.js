const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  User:{

    Id: String,
    Name: String,
    Email: String,
    Points: Int16Array,
    DoneProjects: Array,
    CurrentProjects: Array,
    Friends:Array
  },
  Project:{
Id: String,
Steps: Array,
Author: User,
NoDone: Int16Array
  },
  UserProject:{
Id:String,
Project: Project,
Mentor:User
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
