const User = require('../models/user')
const express = require('express')
const auth = require('../middleware/auth')
const multer  = require('multer')
const upload = multer({ dest: 'avatars' })

const router = express.Router()

router.post('/users/register', async (req, res) => {
    try {
        const user = new User(req.body)

        const token = await user.generateAuthToken()

        user.tokens = user.tokens.concat(token)

        await user.save()

        res.status(201).send({user, token})
    }
    catch (error) {
        res.status(400)

        res.send(error)
    }
})

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()

        user.tokens = user.tokens.concat(token)

        await user.save()

        res.send({ user, token })
    }
    catch (e) {
        res.status(400).send(e)
    }
    
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        const token = req.token

        const user = req.user

        user.tokens = user.tokens.filter((t) => t !== token)

        await user.save()

        res.send()
    }
    catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        const user = req.user
    
        user.tokens = []
    
        await user.save()
    
        res.send('Logged out from all devices')
        
    }
    catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req,res) => {
    try {
        res.send(req.user)
    }
    catch(e){
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async(req, res) => {

    const updateAllowed = ['name', 'age', 'email', 'password']

    const updates = Object.keys(req.body)

    const isAllowed = updates.every((up) => updateAllowed.includes(up))

    if(!isAllowed) {
        return res.status(400).send()
    }

    try {
        const user = req.user
        
        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        res.send(user)
    }
    catch(e) {
        console.log(e)

        res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async(req,res) => {
    try {
        const user = req.user

        await user.remove()

        res.send('User deleted!')
    }
    catch (e) {
        res.status(500).send()
    }
})

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    // console.log(req)
    res.send();
})

module.exports = router