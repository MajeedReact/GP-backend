import express, { Request, Response } from "express";
import checkAuth from "../middleware/auth";
import { authorization } from "../middleware/authorization";
import { category, categories } from "../models/category";

const store = new categories();
const authorziation = new authorization();

const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const allCategories = await store.getAllCategories();
    res.json(allCategories);
  } catch (err) {
    throw new Error(`An Error occured retriving categories: ${err}`);
  }
};

const getProductByCategory = async (req: Request, res: Response) => {
  try {
    const validCategory = await store.getCategoryByID(
      req.params.id as unknown as number
    );

    // console.log(validCategory);
    if (validCategory) {
      const allCategories = await store.getProductByCategory(
        req.params.id as unknown as number
      );
      res.json(allCategories);
    } else {
      res.status(404).json("No Category found");
    }
  } catch (err) {
    throw new Error(`An Error occured retriving categories: ${err}`);
  }
};
const createCategory = async (req: Request, res: Response) => {
  const categories: category = {
    Category_Name: req.body.categoryName,
  };

  try {
    const newCategory = await store.createCategory(categories);
    res.json(newCategory);
  } catch (err) {
    throw new Error("An error occured while creating category " + err);
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deleteCat = await store.deleteCategory(
      req.params.id as unknown as number
    );
    res.json(deleteCat);
  } catch (err) {
    throw new Error(
      "An error occured while deleting category with id  " +
        req.params.id +
        " " +
        err
    );
  }
};
const category_route = (app: express.Application) => {
  app.get("/categories", getAllCategories);
  app.get("/products/category=:id", getProductByCategory);

  app.post("/category", checkAuth, authorziation.adminRole, createCategory);
  app.delete(
    "/category/:id",
    checkAuth,
    authorziation.adminRole,
    deleteCategory
  );
};

export default category_route;
