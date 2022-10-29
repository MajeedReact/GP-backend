"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
const authorization_1 = require("../middleware/authorization");
const category_1 = require("../models/category");
const store = new category_1.categories();
const authorziation = new authorization_1.authorization();
const getAllCategories = async (_req, res) => {
    try {
        const allCategories = await store.getAllCategories();
        res.json(allCategories);
    }
    catch (err) {
        throw new Error(`An Error occured retriving categories: ${err}`);
    }
};
const getProductByCategory = async (req, res) => {
    try {
        const validCategory = await store.getCategoryByID(req.params.id);
        // console.log(validCategory);
        if (validCategory) {
            const allCategories = await store.getProductByCategory(req.params.id);
            res.json(allCategories);
        }
        else {
            res.status(404).json("No Category found");
        }
    }
    catch (err) {
        throw new Error(`An Error occured retriving categories: ${err}`);
    }
};
const createCategory = async (req, res) => {
    const categories = {
        Category_Name: req.body.categoryName,
    };
    try {
        const newCategory = await store.createCategory(categories);
        res.json(newCategory);
    }
    catch (err) {
        throw new Error("An error occured while creating category " + err);
    }
};
const deleteCategory = async (req, res) => {
    try {
        const deleteCat = await store.deleteCategory(req.params.id);
        res.json(deleteCat);
    }
    catch (err) {
        throw new Error("An error occured while deleting category with id  " +
            req.params.id +
            " " +
            err);
    }
};
const category_route = (app) => {
    app.get("/categories", getAllCategories);
    app.get("/products/category=:id", getProductByCategory);
    app.post("/category", auth_1.default, authorziation.adminRole, createCategory);
    app.delete("/category/:id", auth_1.default, authorziation.adminRole, deleteCategory);
};
exports.default = category_route;
