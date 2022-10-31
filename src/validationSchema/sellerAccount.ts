import { body } from "express-validator";

const schema = [
  body("shop_name")
    .isLength({ min: 3, max: 16 })
    .withMessage(
      "Shop name must be at least 3 characters and maximum 16 characters"
    ),
];

export { schema as sellerValidation };
