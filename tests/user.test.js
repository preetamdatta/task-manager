const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

beforeEach(async () => {
    await User.deleteMany()
    const user = new User({
        name: 'testuser1',
        email: 'test1@mail.com',
        password: 'testpass123'
    })
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