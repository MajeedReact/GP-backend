import dashboardAdmin from "../model/dashboard";
import express, { Request, Response } from "express";
import { authorization } from "../../../middleware/authorization";
import checkAuth from "../../../middleware/auth";
const store = new dashboardAdmin();
const auth = new authorization();

const getNumberOfCustomersEachMonth = async (req_: Request, res: Response) => {
  try {
    const result = await store.getNumberOfCustomerEachMonth();
    res.status(200).json(result);
  } catch (error) {
    throw new Error(
      "An Error occured while retriving number of customer each month" + error
    );
  }
};

const getTotalCustomer = async (req_: Request, res: Response) => {
  try {
    const result = await store.getTotalCustomer();
    res.status(200).json(result);
  } catch (error) {
    throw new Error(
      "An Error occured while retriving number of customer each month" + error
    );
  }
};

const numberOfCustomerLast7Days = async (req_: Request, res: Response) => {
  try {
    const result = await store.numberOfCustomerLast7Days();
    res.status(200).json(result);
  } catch (error) {
    throw new Error(
      "An Error occured while retriving number of customers for the last 7 days " +
        error
    );
  }
};

const getNumberOfSellersEachMonth = async (req_: Request, res: Response) => {
  try {
    const result = await store.getNumberOfSellerEachMonth();
    res.status(200).json(result);
  } catch (error) {
    throw new Error(
      "An Error occured while retriving number of Seller each month" + error
    );
  }
};

const numberOfSellersLast7Days = async (req_: Request, res: Response) => {
  try {
    const result = await store.numberOfSellerLast7Days();
    res.status(200).json(result);
  } catch (error) {
    throw new Error(
      "An Error occured while retriving number of Seller for the last 7 days " +
        error
    );
  }
};
const getNumberOfOrdersEachMonth = async (req_: Request, res: Response) => {
  try {
    const result = await store.getNumberOfOrdersEachMonth();
    res.status(200).json(result);
  } catch (error) {
    throw new Error(
      "An Error occured while retriving number of Orders each month" + error
    );
  }
};
const numberOfOrdersLast7Days = async (req_: Request, res: Response) => {
  try {
    const result = await store.numberOfOrdersLast7Days();
    res.status(200).json(result);
  } catch (error) {
    throw new Error(
      "An Error occured while retriving number of Orders for the last 7 days " +
        error
    );
  }
};
const getNumberOfProductsEachMonth = async (req_: Request, res: Response) => {
  try {
    const result = await store.getNumberOfProductsEachMonth();
    res.status(200).json(result);
  } catch (error) {
    throw new Error(
      "An Error occured while retriving number of products each month" + error
    );
  }
};
const numberOfProductsLast7Days = async (req_: Request, res: Response) => {
  try {
    const result = await store.numberOfProductsLast7Days();
    res.status(200).json(result);
  } catch (error) {
    throw new Error(
      "An Error occured while retriving number of products for the last 7 days " +
        error
    );
  }
};
const mostOrderedProduct = async (req_: Request, res: Response) => {
  try {
    const result = await store.mostOrderedProduct();
    res.status(200).json(result);
  } catch (error) {
    throw new Error(
      "An Error occured while retriving most ordered products " + error
    );
  }
};

const dashboardAdmin_route = (app: express.Application) => {
  app.get(
    "/customerEachMonth",
    checkAuth,
    auth.adminRole,
    getNumberOfCustomersEachMonth
  );
  app.get("/totalCustomer", checkAuth, auth.adminRole, getTotalCustomer);
  app.get(
    "/customerLast7Days",
    checkAuth,
    auth.adminRole,
    numberOfCustomerLast7Days
  );
  app.get(
    "/sellerEachMonth",
    checkAuth,
    auth.adminRole,
    getNumberOfSellersEachMonth
  );
  app.get(
    "/sellerLast7Days",
    checkAuth,
    auth.adminRole,
    numberOfSellersLast7Days
  );
  app.get(
    "/OrdersEachMonth",
    checkAuth,
    auth.adminRole,
    getNumberOfOrdersEachMonth
  );
  app.get(
    "/OrdersLast7Days",
    checkAuth,
    auth.adminRole,
    numberOfOrdersLast7Days
  );
  app.get(
    "/ProductsLastMonth",
    checkAuth,
    auth.adminRole,
    getNumberOfProductsEachMonth
  );
  app.get(
    "/ProductsLast7Days",
    checkAuth,
    auth.adminRole,
    numberOfProductsLast7Days
  );
  app.get("/MostOrderedProduct", checkAuth, auth.adminRole, mostOrderedProduct);
};
export default dashboardAdmin_route;
