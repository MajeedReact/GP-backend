import express, { Request, Response } from "express";
import roles_route from "./handlers/roles";
import admin_route from "./handlers/admins";
import seller_route from "./handlers/sellers";
import customer_route from "./handlers/customers";
import order_route from "./handlers/order";
import category_route from "./handlers/category";
import product_route from "./handlers/product";
import review_route from "./handlers/review";
import cookieParser from "cookie-parser";
import cors from "cors";
import cpu_route from "./services/compatibility/handlers/cpu";
import gpu_route from "./services/compatibility/handlers/gpu";
import memory_route from "./services/compatibility/handlers/memory";
import motherboard_route from "./services/compatibility/handlers/motherboard";
import dashboardAdmin_route from "./dashboard/admin/handler/dashboard";
import dashboardSeller_route from "./dashboard/seller/handler/dashboard";

const app: express.Application = express();
const port: string = "3000";

// //so any website can use this API and not get blocked by CORS
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "*"); // update to match the domain you will make the request from
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.get("/", function (req: Request, res: Response) {
  res.send("Working");
});

// change origin to frontend
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

//this is used to parse request from the body to json
app.use(express.json());
//parse cookies
app.use(cookieParser());

roles_route(app);
admin_route(app);
seller_route(app);
customer_route(app);
order_route(app);
category_route(app);
product_route(app);
review_route(app);
cpu_route(app);
gpu_route(app);
memory_route(app);
motherboard_route(app);
dashboardAdmin_route(app);
dashboardSeller_route(app);

app.listen(3000, function () {
  console.log(`Starting app on: http://localhost:${port}`);
});
