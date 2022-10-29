"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roles_1 = __importDefault(require("./handlers/roles"));
const admins_1 = __importDefault(require("./handlers/admins"));
const sellers_1 = __importDefault(require("./handlers/sellers"));
const customers_1 = __importDefault(require("./handlers/customers"));
const order_1 = __importDefault(require("./handlers/order"));
const category_1 = __importDefault(require("./handlers/category"));
const product_1 = __importDefault(require("./handlers/product"));
const review_1 = __importDefault(require("./handlers/review"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const cpu_1 = __importDefault(require("./services/compatibility/handlers/cpu"));
const gpu_1 = __importDefault(require("./services/compatibility/handlers/gpu"));
const memory_1 = __importDefault(require("./services/compatibility/handlers/memory"));
const motherboard_1 = __importDefault(require("./services/compatibility/handlers/motherboard"));
const dashboard_1 = __importDefault(require("./dashboard/admin/handler/dashboard"));
const dashboard_2 = __importDefault(require("./dashboard/seller/handler/dashboard"));
const app = express_1.default();
const port = "3000";
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
app.get("/", function (req, res) {
    res.send("Working");
});
// change origin to frontend
app.use(cors_1.default({
    origin: "http://localhost:4200",
    credentials: true,
}));
//this is used to parse request from the body to json
app.use(express_1.default.json());
//parse cookies
app.use(cookie_parser_1.default());
roles_1.default(app);
admins_1.default(app);
sellers_1.default(app);
customers_1.default(app);
order_1.default(app);
category_1.default(app);
product_1.default(app);
review_1.default(app);
cpu_1.default(app);
gpu_1.default(app);
memory_1.default(app);
motherboard_1.default(app);
dashboard_1.default(app);
dashboard_2.default(app);
app.listen(3000, function () {
    console.log(`Starting app on: http://localhost:${port}`);
});
exports.default = app;
