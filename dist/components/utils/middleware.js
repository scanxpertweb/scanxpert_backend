"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        schema.validateSync(req.body)
            .then(() => next())
            .catch((err) => res.status(400).send(err.details));
    };
};
exports.validate = validate;
