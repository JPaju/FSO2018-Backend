const palindrom = (string) => {
    return string.split('').reverse().join('')
}

const average = (array) => {
    const summer = (sum, item) => {
        return sum + item
    }

    return array.length === 0 ? 0 : array.reduce(summer, 0) / array.length
}

module.exports = {
    palindrom,
    average
}
