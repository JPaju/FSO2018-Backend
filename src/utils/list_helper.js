const dummy = () => 1


const totalLikes = (blogs) => (
    blogs.reduce((sum, blog) => (sum + blog.likes), 0)
)

const favoriteBlog = (blogs) => (
    objWithLargestValue(blogs, 'likes')
)

const mostBlogs = (blogs) => {
    //Create array of objects containing blog authors and their blog count
    // e.g { author: "Java Scripter", blogs: 6}
    const authors = blogs.reduce((authors, blog) => {
        const author = authors.filter(x => x.author === blog.author)[0] || authors[authors.push({ author: blog.author, blogs: 0 }) - 1]
        author.blogs++
        return authors
    }, [])

    return objWithLargestValue(authors, 'blogs')
}

const mostLikes = (blogs) => {
    //Create array of objects containing blog authors and sum of likes in all of their blogs
    // e.g { author: "Java Scripter", likes: 10}
    const authors = blogs.reduce((authors, blog) => {
        const author = authors.filter(x => x.author === blog.author)[0] || authors[authors.push({ author: blog.author, likes: 0 }) - 1]
        author.likes += blog.likes
        return authors
    }, [])

    return objWithLargestValue(authors, 'likes')
}

const largerByValue = (valueName) => (maxValueObj, obj) => (
    maxValueObj[valueName] > obj[valueName] ? maxValueObj : obj
)

//Helperfunction
const objWithLargestValue = (array, valueName) => (
    array.reduce(largerByValue(valueName), array.length > 0 ? array[0] : undefined)
)


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}