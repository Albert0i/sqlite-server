const verifyCmdTextArray = (req, res, next) => {
    const cmdTextArray = req.body.cmdTexts

    if (!Array.isArray(cmdTextArray) || cmdTextArray.length==0)
        return res.status(400).json({ success: false, 
                                      message: 'cmdTexts must be array of string.' })

    let cmdText = ''
    let token = ''
    for (i = 0; i < cmdTextArray.length; i++) 
    {
        cmdText = cmdTextArray[i]
        if (typeof cmdText !== 'string')
            return res.status(400).json({ success: false, 
                                          message: 'cmdTexts must be array of string.',
                                          cmdText})

        token = cmdText.trim().split(' ')[0].toLowerCase()
        if (token !== 'insert' && token !== 'update' && token !== 'delete') 
            return res.status(400).json({ success: false, 
                                          message: 'insert, update or delete statement expected.', 
                                          cmdText })
    }

    next()
}

module.exports = verifyCmdTextArray 