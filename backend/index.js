const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors(
    {
        origin: "https://travellers-pt-zeta.vercel.app",
        methods: ["POST", "GET"],
        credentials: true
    }
));

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

mongoose.connect(process.env.MONGO_URL, { tls: true })
    .then(() => {
        console.log("MongoDB Connected!")
    })
    .catch((err) => console.log(err));

const userRoute = require("./routes/users");
app.use("/api/users", userRoute);
        
const travelRoute = require("./routes/travels");
app.use("/api/travels", travelRoute);    

app.listen(8080, () => {
    console.log("server running on Port 8080");
})
