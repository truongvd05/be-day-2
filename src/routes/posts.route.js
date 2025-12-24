const express = require("express");
const { loadDB, createDB } = require("../../utils/jsonDB");

const router = express.Router();

router.get("/", async (req, res) => {
    const db = await loadDB();
    db.posts ??= [];
    res.json(db.posts);
});
router.get("/:id", async (req, res) => {
    const db = await loadDB();
    db.posts ??= [];

    const id = +req.params.id;
    const post = db.posts.find((_post) => _post.id === id);
    if (!post) {
        return res.status(404).json({
            message: "Post not Found",
        });
    }
    res.status(200).json(post);
});
router.post("/", async (req, res) => {
    const db = await loadDB();
    db.posts ??= [];
    const { title, content } = req.body;
    if (
        typeof title !== "string" ||
        typeof content !== "string" ||
        !title.trim() ||
        !content.trim()
    ) {
        return res.status(400).json({
            message: "Title or content are required",
        });
    }
    const lastId = db.posts.at(-1)?.id || 0;
    const newPost = {
        id: lastId + 1,
        title,
        content,
        createdAt: new Date().toISOString(),
    };
    db.posts.push(newPost);
    await createDB(db);
    res.status(201).json(newPost);
});
router.put("/:id", async (req, res) => {
    const db = await loadDB();
    db.posts ??= [];
    const id = +req.params.id;
    const { title, content } = req.body;
    if (
        (title != null && (typeof title !== "string" || !title.trim())) ||
        (content != null && (typeof content !== "string" || !content.trim()))
    ) {
        return res.status(400).json({
            message: "Invalid title or content",
        });
    }
    const post = db.posts.find((_post) => _post.id === id);
    if (!post) {
        return res.status(404).json({
            message: "Post not found",
        });
    }
    if (title != null) post.title = title;
    if (content != null) post.content = content;
    await createDB(db);
    res.status(200).json(post);
});
router.delete("/:id", async (req, res) => {
    const db = await loadDB();
    db.posts ??= [];
    const id = +req.params.id;
    const index = db.posts.findIndex((_post) => _post.id === id);
    if (index === -1) {
        return res.status(404).json({
            message: "Post not Found",
        });
    }
    db.posts.splice(index, 1);
    await createDB(db);
    res.status(204).end();
});

module.exports = router;
