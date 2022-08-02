const {
  selectTopics,
  selectArticleById,
  patchVoteById,
} = require("../models/models");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateVoteById = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  patchVoteById(article_id, body.inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};