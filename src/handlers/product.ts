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

const getAllProductsFromSeller = async (req: Request, res: Response) => {
  try {
    const products = await store.getAllProductsFromSeller(
      req.params.id as unknown as number
    );
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
    product_name: req.body.product_name,
    product_quantity: req.body.product_quantity,
    product_description: req.body.product_description,
    product_thumbnail: req.body.product_thumbnail,
    tags: req.body.tags,
    price: req.body.price,
    lat: req.body.lat,
    lan: req.body.lan,
    city: req.body.city,
    neighborhood: req.body.neighborhood,
    seller_id: sellerID.seller_id as number,
    category_id: req.body.category_id as number,
  };
  console.log(products);

  try {
    const newProduct = await store.createProduct(products);
    res.json(newProduct);
  } catch (err) {
    throw new Error("An error occured while creating product " + err);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleteCat = await store.deleteProduct(
      req.params.id as unknown as number
    );
    res.status(200).json("success");
  } catch (err) {
    throw new Error(
      "An error occured while deleting product with id  " +
        req.params.id +
        " " +
        err
    );
  }
};

const updateProduct = async (req: Request, res: Response) => {
  //get seller id
  var token = req.cookies.token;
  var sellerID = jwt.decode(token) as seller;

  const products: any = {
    product_id: req.body.product_id,
    product_name: req.body.product_name,
    product_thumbnail: req.body.product_thumbnail,
    product_quantity: req.body.product_quantity,
    product_description: req.body.product_description,
    tags: req.body.tags,
    price: req.body.price,
    lat: req.body.lat,
    lan: req.body.lan,
    city: req.body.city,
    neighborhood: req.body.neighborhood,
    category_id: req.body.category_id as number,
  };

  console.log(products);
  if (!products.product_id) {
    return res.status(400).json("bad request");
  }

  try {
    if (products.product_thumbnail != "") {
      const newProduct = await store.updateProduct(products);
      res.json(newProduct);
    } else {
      const newProduct = await store.updateProductWithoutImage(products);
      res.json(newProduct);
    }
  } catch (err) {
    throw new Error("An error occured while creating product " + err);
  }
};
const searchProduct = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;
    let query = req.params.query;
    query = "'''" + query + "'''";

    if (req.params.city != "all") {
      const products = await store.searchProduct(query, city);

      res.status(200).json(products);
      return;
    }

    const products = await store.searchProductWithoutCity(query);

    res.status(200).json(products);
    return;
  } catch (err) {
    throw new Error(`An Error occured retriving products: ${err}`);
  }
};
const getCities = async (req: Request, res: Response) => {
  try {
    const cities = await store.getCities();

    res.status(200).json(cities);
  } catch (err) {
    throw new Error(`An Error occured retriving products: ${err}`);
  }
};
const product_route = (app: express.Application) => {
  app.get("/product", getAllProducts);
  app.get("/product/:id", getProductWithId);
  app.get("/new-products", getLatestProducts);
  app.get("/products/seller/:id", getAllProductsFromSeller);
  app.get("/cities", getCities);
  app.get("/search/:query/:city", searchProduct);
  app.post("/product", checkAuth, auth.checkSellerOrAdmin, createProduct);
  app.put("/product/:id", checkAuth, auth.checkSellerOrAdmin, updateProduct);
  app.delete("/product/:id", checkAuth, auth.adminRole, deleteProduct);
};

export default product_route;
