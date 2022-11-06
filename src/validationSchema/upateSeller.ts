import { body } from "express-validator";

const schema = [
  body("shop_name")
    .isLength({ min: 3, max: 16 })
    .withMessage(
      "Shop name must be at least 3 characters and maximum 16 characters"
    ),
  body("seller_email").isEmail().withMessage("Enter a valid email address"),
  body("seller_password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export { schema as updateSellerValidation };
