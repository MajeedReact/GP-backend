"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const token_1 = require("../helpers/token");
const request = supertest_1.default(server_1.default);
describe("User Endpoints", () => {
    it("GET all customers will result in status 401 for not being logged in", async () => {
        const result = await request.get("/customers");
        expect(result.status).toBe(401);
    });
    it("GET all customers will result in status 200 for being logged in as admin", async () => {
        const result = await request
            .get("/customers")
            .set("Cookie", `token=${token_1.token}`);
        expect(result.status).toBe(200);
    });
    it("Creating a customer with invalid email should return 400 for having a bad email", async () => {
        const customer = {
            customer_email: "dummy.com",
            cus_first_name: "dummy",
            cus_last_name: "dum",
            customer_password: "dummy123",
            role_id: 1,
        };
        const result = await request.post("/customer").send(customer);
        expect(result.status).toBe(400);
    });
});
