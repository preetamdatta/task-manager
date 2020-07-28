const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')



beforeEach(setupDatabase)

test('Should create a user', async () => {
    const response = await request(app).post('/users/register').send({
        name: 'testuser',
        email: 'test@mail.com',
        password: 'testpass123'
    }).expect(201)

    const user = User.findById(response.body.user._id)
    expect(user).not.toBeNull()
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'test1@mail.com',
        password: 'testpass123'
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.tokens[1]).toBe(response.body.token)
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

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should not delete profile for unauthenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(500)
})

test('should upload image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .attach('/fixtures/profile-pic.jpg')
        .send()
        .expect(200)
})

test('Should update valid update fields', async ()=> {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .send({
            name: 'user1'
        })
        .expect(200)

    const user = await User.findById(userOneId)

    expect(user.name).toBe('user1')
})

test('Should not update invalid update fields', async ()=> {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .send({
            location: 'India'
        })
        .expect(400)
})