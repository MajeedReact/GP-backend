import { body } from "express-validator";

const schema = [
  body("rating")
    .isLength({ min: 1, max: 5 })
    .withMessage("Review rating must be at least 1 maximum 5"),
];

export { schema as ratingValidation };
