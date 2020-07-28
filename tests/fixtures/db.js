const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'testuser1',
    email: 'test1@mail.com',
    password: 'testpass123',
    tokens: [
        jwt.sign({id: userOneId}, process.env.JWT_SECRET_KEY)
    ]
}

const userTwoId = mongoose.Types.ObjectId()

const userTwo = {
    _id: userTwoId,
    name: 'testuser2',
    email: 'test2@mail.com',
    password: 'testpass123',
    tokens: [
        jwt.sign({id: userTwoId}, process.env.JWT_SECRET_KEY)
    ]
}

const taskOne = {
    _id: mongoose.Types.ObjectId(),
    Description: 'Task one',
    Completed: false,
    Owner: userOne._id
}

const taskTwo = {
    _id: mongoose.Types.ObjectId(),
    Description: 'Task two',
    Completed: true,
    Owner: userOne._id
}

const taskThree = {
    _id: mongoose.Types.ObjectId(),
    Description: 'Task three',
    Completed: false,
    Owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await Task.deleteMany()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()

}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}