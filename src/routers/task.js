const Task = require('../models/task')
const express = require('express')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/tasks', auth, async (req,res) => {
    const task = new Task({
        ...req.body,
        Owner: req.user.id
    })

    try {
        await task.save()
        res.status(201).send(task)
    }
    catch(error) {
        res.status(400)
        res.send(error)
    }
})

router.get('/tasks', auth, async (req,res) => {
    try {
        const queryCondition = req.query.completed ? {
            Owner : req.user.id,
            Completed : req.query.completed === 'true'
        } : {
            Owner : req.user.id
        }

        let sort = {}

        if(req.query.sort) {
            const mySort = req.query.sort.split(':')
            const sortBy = mySort[0]
            const sortOption = mySort[1] === 'asc' ? 1 : -1
            sort = {  [sortBy]: sortOption }
        }

        const tasks = await Task.find(queryCondition, null, {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        })
                
        res.send(tasks)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks/:id', auth, async (req,res) => {
    try {
        const tasks = await Task.findOne({_id: req.params.id, Owner: req.user.id})

        if(!tasks) return res.status(404).send()

        res.send(tasks)
    }
    catch {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async(req, res) => {

    const updateAllowed = ['Description', 'Completed']

    const updates = Object.keys(req.body)

    const isAllowed = updates.every((up) => updateAllowed.includes(up))

    if(!isAllowed) {
        return res.status(404).send()
    }

    try {
        const task = await Task.findOne({_id: req.params.id, Owner: req.user.id})

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        if(!task) return res.status(404).send()

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        res.send(task)
    }
    catch(e) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id', auth, async(req,res) => {
    try {
        const task = await Task.deleteOne({_id: req.params.id, Owner: req.user.id})

        if(task.deletedCount === 0) return res.status(404).send()

        res.send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router