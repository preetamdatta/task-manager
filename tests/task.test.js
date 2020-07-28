const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {userOneId, userOne, userTwo, setupDatabase, taskOne, taskTwo, taskThree} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create a task', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .send({
        Description: 'Test task'
    }).expect(201)

    const task = Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('Should fetch all current user\'s tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0]}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})

test('Should not delete other users task', async () => {
    await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userTwo.tokens[0]}`)
        .send()
        .expect(404)

    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})