require("module-alias/register");
var express = require("express");
var cors = require("cors");
var app = express();
const appRoute = require("@/routes");

const port = process.env.PORT || 3000;

const ALLOWED_ORIGIN = process.env.CLIENT_URL || "http://localhost:5173";

let allowMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];

let corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGIN.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allow by CORS"));
        }
    },
    methods: allowMethods,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", appRoute);
app.use((err, _, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON format",
        });
    }
    next(err);
});
app.listen(port, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000");
});
