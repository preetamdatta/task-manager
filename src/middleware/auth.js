const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const user = await User.findOne({_id : decoded.id, tokens: token})

        if(!user) res.status(401).send('Unauthorized')

        req.token = token

        req.user = user

        next()
    }
    catch (e) {
        res.status(500).send()

    }
}

module.exports = auth