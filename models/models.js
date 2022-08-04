const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((res) => {
    return res.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id HAVING articles.article_id = $1;",
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "No Article exists with that Id!",
        });
      }
      rows[0].comment_count = +rows[0].comment_count;
      return rows[0];
    });
};

exports.patchVoteById = (article_id, voteNum) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [voteNum, article_id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "No Article exists with that Id!",
        });
      }
      return rows[0];
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((res) => {
    return res.rows;
  });
};

exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
    )
    .then(({ rows }) => {
      rows.forEach((elem) => (elem.comment_count = +elem.comment_count));
      return rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;",
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkIfArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles where article_id = $1", [article_id])
    .then(({ rows }) => {
      if (!rows[0]) {
        console.log(rows);
        return Promise.reject({
          status: 404,
          msg: "No Article exists with that Id!",
        });
      }
    });
};
