"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const auth_1 = __importDefault(require("../middleware/auth"));
const authorization_1 = require("../middleware/authorization");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store = new product_1.products();
const auth = new authorization_1.authorization();
const getAllProducts = async (_req, res) => {
    try {
        const products = await store.getAllProducts();
        res.json(products);
    }
    catch (err) {
        throw new Error(`An Error occured retriving products: ${err}`);
    }
};
const getAllProductsFromSeller = async (req, res) => {
    try {
        const products = await store.getAllProductsFromSeller(req.params.id);
        res.json(products);
    }
    catch (err) {
        throw new Error(`An Error occured retriving products: ${err}`);
    }
};
const getLatestProducts = async (_req, res) => {
    try {
        const latestProducts = await store.latestProducts();
        res.json(latestProducts);
    }
    catch (err) {
        throw new Error(`An Error occured retriving products: ${err}`);
    }
};
const getProductWithId = async (req, res) => {
    try {
        const product = await store.getProductWithId(req.params.id);
        res.json(product);
    }
    catch (err) {
        throw new Error(`An Error occured retriving product with id ${req.params.id} ${err}`);
    }
};
const createProduct = async (req, res) => {
    //get seller id
    var token = req.cookies.token;
    var sellerID = jsonwebtoken_1.default.decode(token);
    const products = {
        product_name: req.body.product_name,
        product_quantity: req.body.product_quantity,
        product_description: req.body.product_description,
        tags: req.body.tags,
        price: req.body.price,
        lat: req.body.lat,
        lan: req.body.lan,
        city: req.body.city,
        neighborhood: req.body.neighborhood,
        seller_id: sellerID.seller_id,
        category_id: req.body.category_id,
    };
    console.log(products);
    try {
        const newProduct = await store.createProduct(products);
        res.json(newProduct);
    }
    catch (err) {
        throw new Error("An error occured while creating product " + err);
    }
};
// const deleteCategory = async (req: Request, res: Response) => {
//   try {
//     const deleteCat = await store.deleteCategory(
//       req.params.id as unknown as number
//     );
//     res.json(deleteCat);
//   } catch (err) {
//     throw new Error(
//       "An error occured while deleting category with id  " +
//         req.params.id +
//         " " +
//         err
//     );
//   }
// };
const product_route = (app) => {
    app.get("/product", getAllProducts);
    app.get("/product/:id", getProductWithId);
    app.get("/new-products", getLatestProducts);
    app.get("/products/seller/:id", getAllProductsFromSeller);
    app.post("/product", auth_1.default, auth.checkSellerOrAdmin, createProduct);
    // app.delete("/product/:id", deleteCategory);
};
exports.default = product_route;
