/* eslint-disable func-names */
module.exports = function (model, overrides) {
  const controller = {
    getAll(req, res, next) {
      model.find({}, (err, docs) => {
        if (err) next(err);
        res.json(docs);
      });
    },
  };

  if (!overrides) {
    // eslint-disable-next-line no-param-reassign
    overrides = {};
  }

  return { ...controller, ...overrides };
};
