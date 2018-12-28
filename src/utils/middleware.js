const morgan = require('morgan')
morgan.token('json', (req) => JSON.stringify(req['body']))

const logger = () => (
    morgan(':method :url :json :status :res[content-length] - :response-time ms')
)

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    logger,
    error
}