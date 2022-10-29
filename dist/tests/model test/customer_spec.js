"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customers_1 = require("../../models/customers");
const store = new customers_1.customers();
describe("Customer functionalities", () => {
    it("It should create a customer", async () => {
        const result = await store.createCustomerWithoutHash({
            customer_email: "dummy@gmail.com",
            cus_first_name: "dummy",
            cus_last_name: "dum",
            customer_password: "dummy123",
            role_id: 1,
        });
        let date = new Date("Sat Oct 29 2022 00:00:00 GMT+0300 (Arabian Standard Time)");
        expect(result).toEqual({
            customer_id: 1,
            customer_email: "dummy@gmail.com",
            cus_first_name: "dummy",
            cus_last_name: "dum",
            customer_password: "dummy123",
            created_at: date,
            role_id: "1",
        });
    });
    it("It should get a customer by id", async () => {
        const result = await store.getCustomerWithId(1);
        let date = new Date("Sat Oct 29 2022 00:00:00 GMT+0300 (Arabian Standard Time)");
        expect(result).toEqual({
            customer_id: 1,
            customer_email: "dummy@gmail.com",
            cus_first_name: "dummy",
            cus_last_name: "dum",
            customer_password: "dummy123",
            created_at: date,
            role_id: "1",
        });
    });
});
