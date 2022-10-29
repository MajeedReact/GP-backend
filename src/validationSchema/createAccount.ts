import { body } from "express-validator";

const schema = [
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export { schema as createAccountValidation };
