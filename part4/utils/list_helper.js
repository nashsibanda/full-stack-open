const dummy = () => {
  return 1;
};

const totalLikes = blogs => {
  const reducer = (acc, cur) => {
    return acc + cur.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = blogs => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
  return sortedBlogs[0];
};

const mostBlogs = blogs => {
  const authorObject = {};
  blogs.forEach(({ author }) =>
    authorObject[author]
      ? (authorObject[author] += 1)
      : (authorObject[author] = 1)
  );
  return Object.entries(authorObject).sort((a, b) => b[1] - a[1])[0][0];
};

const mostLikes = blogs => {
  const authorObject = {};
  blogs.forEach(({ author, likes }) =>
    authorObject[author]
      ? (authorObject[author] += likes)
      : (authorObject[author] = likes)
  );
  return Object.entries(authorObject).sort((a, b) => b[1] - a[1])[0][0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
