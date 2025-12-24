const express = require("express");

const router = express.Router();

const postRoute = require("@/routes/posts.route");
const comentRoute = require("@/routes/comments.route");

router.use("/posts", postRoute);
router.use("/comments", comentRoute);

module.exports = router;
