import express, { Request, response, Response } from "express";
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





//dialogflow
const {WebhookClient} = require('dialogflow-fulfillment')
//app.use(express.json())
app.use('/webhook', (req, res) => {
  // get agent from request
  let agent = new WebhookClient({req: Request, res: Response})
  //create intentMap for handel intent
  let intentMap = new Map();
  // add intent map 2nd parameter pass function
  intentMap.set('backend',handleWebHookIntent)
  // now agent is handle request and pass intent map
  agent.handleRequest(intentMap)
});

//function handleWebHookIntent(agent:any){ //i add :any to it to solve the problem
  // function handleWebHookIntent(agent: { add: (arg0: string) => void; }){ //this auto fix
     function handleWebHookIntent(agent:any){
      agent.add("Hello I am Webhook demo How are you...")
 
  };

  //end of dialogflow
  

// app.get('/', (req, res) => {
//   res.send("Server Is Working......")
// })


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

//second testing for df
//require('./routes/df-routes')(app)


//end of second testing

//thired tsting df
app.use(express.urlencoded({
  extended:true
}));
app.use(express.json())

  app.post('/chat-bot', (req, res) => {
// console.log(req.body);
// res.send({ fulfillmentText: 'Hello from the webhook.'});
    //console.log(JSON.stringify(req.body.queryResult.outputContexts));

    let session = req.body.session;

    // Any logic

    let context_name = `${session}/contexts/DWI`;
    // let place = `${session}/contexts/await_first`;
    // let type = `${session}/contexts/await_first`;
    // let price = `${session}/contexts/await_first`;
console.log(req.body.queryResult.parameters);
    res.send({
        fulfillmentText: 'HI,welcome to CCB Chatbot assistant i am here to help you choose best device based on you answer do you want to start? backend',
           outputContexts: [
            {
              name: context_name,
                // place_par: place,
                // type_par: type,
                // price_par: price,
                lifespanCount: 1,
                parameters: {
                  name:'moh'
                  // place_par: 'laptoop',
                  // type_par: 'gamming',
                  // price_par: '3000'
                }
            }
        ]
    });
});
//end of thired testing

//home route
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
export default app;
