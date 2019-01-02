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

const tokenExtractor = (request, response, next) => {
    try {
        const auth = request.get('authorization')
        const authStartIndex = auth.indexOf(' ')
        if (authStartIndex > 0)
            request.token = auth.substring(authStartIndex+1)
    } catch(e) {null}
    next()
}

module.exports = {
    logger,
    error,
    tokenExtractor
}