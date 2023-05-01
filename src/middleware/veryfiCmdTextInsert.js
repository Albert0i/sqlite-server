const verifyCmdTextInsert = (req, res, next) => {
    const cmdText = req.body.cmdText

    if (typeof cmdText !== 'string')
        return res.status(400).json({ success: false, message: 'cmdText must a string.'})

    if (cmdText.trim().split(' ')[0].toLowerCase() !== 'insert') 
        return res.status(400).json({ success: false, message: 'insert statement expected.'})

    next()
}

module.exports = verifyCmdTextInsert