const verifyPassphrase = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    if (token === process.env.PASSPHRASE) {
        next()
    }
    else {
        res.status(403).json({ message: 'Forbidden' })
    }
}

module.exports = verifyPassphrase 