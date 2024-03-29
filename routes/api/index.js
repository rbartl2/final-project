const router = require("express").Router();

router.use("/inventory", require("./inventory"));
router.use("/posts", require("./post"));
router.use("/users", require("./user"));
router.use("/profiles", require("./profile"))

router.use( function(err, req, res, next) {
    if (err.name === "ValidationError" ) {
        return res.status(422).json({
            errors: Object.keys(err.errors).reduce( function(errors, key) {
                errors[key] = err.errors[key].message;

                return errors;
            }, {})
        });
    }

    return next(err);
});

module.exports = router;
