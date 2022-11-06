import { body } from "express-validator";

const schema = [
  body("product_name")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters"),
  body("product_quantity")
    .isInt({ min: 1, max: 20 })
    .withMessage("Product quantity cannot be less than 1 and maximum 20"),
  body("city")
    .isLength({ min: 3 })
    .withMessage("City must be at least 3 characters"),
  body("category_id")
    .isLength({ min: 1 })
    .withMessage("Category cannot be empty"),
  body("lat").isLength({ min: 2 }).withMessage("Not a valid latitude"),
  body("lan").isLength({ min: 2 }).withMessage("Not a valid longtitude"),
  body("price").notEmpty().withMessage("Price cannot be empty"),
  body("price")
    .isInt({ gt: 50 })
    .withMessage("Price cannot be less than 50 SAR"),
];

export { schema as productValidation };
