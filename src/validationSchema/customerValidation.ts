import { body } from "express-validator";

const schema = [
  body("cus_first_name")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters"),
  body("cus_last_name")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters"),
];

export { schema as customerValidation };
