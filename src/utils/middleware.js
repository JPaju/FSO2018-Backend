const morgan = require('morgan')
morgan.token('json', (req) => JSON.stringify(req['body']))

const logger = () => (
    process.env.NODE_ENV !== 'test' ?
        morgan(':method :url :json :status :res[content-length] - :response-time ms') :
        ({ next }) => next()
)

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    logger,
    error
}