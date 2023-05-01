const handle404 = (req, res) => {
    setTimeout(()=>{
        res.sendStatus(404)
    }, Math.ceil(Math.random() * Number(process.env.DELAY404)))
}

module.exports = { handle404 }