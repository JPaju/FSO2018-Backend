const dummy = () => 1


const totalLikes = (blogs) => (
    blogs.reduce((sum, blog) => (sum + blog.likes), 0)
)

const favoriteBlog = (blogs) => (
    blogs.reduce((favorite, blog) => (
        favorite.likes > blog.likes ? favorite : blog
    ), blogs.length > 0 ? blogs[0] : undefined)
)

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}