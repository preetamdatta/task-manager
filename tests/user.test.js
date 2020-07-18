const request = require('supertest')
const app = require('../src/app')

test('User creation test', async () => {
    await request(app).post('/users/register').send({
        name: 'testuser',
        email: 'test@mail.com',
        password: 'testpass123'
    }).expect(201)
})