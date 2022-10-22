import express, { Request, Response } from "express";
import { product, products } from "../models/product";
import checkAuth from "../middleware/auth";
import { authorization } from "../middleware/authorization";
import jwt, { Secret } from "jsonwebtoken";
import { customer } from "../models/customers";
import { seller } from "../models/Sellers";
import { admins } from "../models/admins";

const store = new products();
const auth = new authorization();

const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await store.getAllProducts();
    res.json(products);
  } catch (err) {
    throw new Error(`An Error occured retriving products: ${err}`);
  }
};

const getLatestProducts = async (_req: Request, res: Response) => {
  try {
    const latestProducts = await store.latestProducts();
    res.json(latestProducts);
  } catch (err) {
    throw new Error(`An Error occured retriving products: ${err}`);
  }
};
const getProductWithId = async (req: Request, res: Response) => {
  try {
    const product = await store.getProductWithId(
      req.params.id as unknown as number
    );
    res.json(product);
  } catch (err) {
    throw new Error(
      `An Error occured retriving product with id ${req.params.id} ${err}`
    );
  }
};

const createProduct = async (req: Request, res: Response) => {
  //get seller id
  var token = req.cookies.token;
  var sellerID = jwt.decode(token) as seller;

  const products: product = {
    product_name: req.body.pName,
    product_quantity: req.body.pQuantity,
    product_description: req.body.pDescription,
    tags: req.body.pTag,
    price: req.body.price,
    lat: req.body.lat,
    lan: req.body.lan,
    city: req.body.city,
    neighborhood: req.body.neighboor,
    seller_id: sellerID.seller_id as number,
    category_id: 2,
  };

  try {
    const newProduct = await store.createProduct(products);
    res.json(newProduct);
  } catch (err) {
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
const product_route = (app: express.Application) => {
  app.get("/product", getAllProducts);
  app.get("/product/:id", getProductWithId);
  app.get("/new-products", getLatestProducts);
  app.post("/product", checkAuth, auth.checkSellerOrAdmin, createProduct);
  // app.delete("/product/:id", deleteCategory);
};

export default product_route;
