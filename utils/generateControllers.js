module.exports = function (model, overrides) {
    var controller = {
        getAll: function (req, res, next) {
            model.find({}, function (err, docs) {
                if (err) next(err);
                res.json(docs);
            });
        }
    };

    if (!overrides) {
        overrides = {}
    }

    return Object.assign({}, controller, overrides);
};