const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

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

beforeEach(async () => {
    await User.deleteMany()
    const user = new User(userOne)
    await user.save()
})

test('User creation test', async () => {
    await request(app).post('/users/register').send({
        name: 'testuser',
        email: 'test@mail.com',
        password: 'testpass123'
    }).expect(201)
})

test('Should login existing user', async() => {
    await request(app).post('/users/login').send({
        email: 'test1@mail.com',
        password: 'testpass123'
    }).expect(200)
})

test('Should not login non-existing user', async() => {
    await request(app).post('/users/login').send({
        email: 'test12@mail.com',
        password: 'testpass1234'
    }).expect(400)
})

test('should get profile for user', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .send()
        .expect(200)
})

test('should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(500)
})

test('should delete profile for user', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .send()
        .expect(200)
})

test('should not delete profile for unauthenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(500)
})