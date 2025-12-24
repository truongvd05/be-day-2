const express = require("express");
const { loadDB, createDB } = require("../../utils/jsonDB");

const router = express.Router();

router.get("/", async (req, res) => {
    const db = await loadDB();
    db.comments ??= [];
    res.json(db.comments);
});

router.get("/:id", async (req, res) => {
    const db = await loadDB();
    db.comments ??= [];
    const id = +req.params.id;
    const comment = db.comments.find((_comment) => _comment.id === id);
    if (!comment) {
        return res.status(404).json({
            message: "Comment not Found",
        });
    }
    res.status(200).json(comment);
});
router.post("/", async (req, res) => {
    const db = await loadDB();
    db.comments ??= [];
    const { postId, content } = req.body;
    if (postId == null || typeof content !== "string" || !content.trim()) {
        return res.status(400).json({
            message: "postId or content are required",
        });
    }
    const lastId = db.comments.at(-1)?.id || 0;
    const newComent = {
        id: lastId + 1,
        postId,
        content,
        createdAt: new Date().toISOString(),
    };
    db.comments.push(newComent);
    await createDB(db);
    res.status(201).json(newComent);
});

router.put("/:id", async (req, res) => {
    const db = await loadDB();
    db.comments ??= [];
    const id = +req.params.id;
    const { content, postId } = req.body;
    if (typeof content !== "string" || !content.trim()) {
        return res.status(400).json({
            message: "Invalid content",
        });
    }
    if (postId != null && typeof postId !== "number") {
        return res.status(400).json({
            message: "Invalid postId",
        });
    }
    const comment = db.comments.find((_comment) => _comment.id === id);
    if (!comment) {
        return res.status(404).json({
            message: "Comment not found",
        });
    }
    comment.content = content;
    if (postId != null) comment.postId = postId;
    await createDB(db);
    res.status(200).json(comment);
});
router.delete("/:id", async (req, res) => {
    const db = await loadDB();
    db.comments ??= [];
    const id = +req.params.id;
    const index = db.comments.findIndex((_comment) => _comment.id === id);
    if (index === -1) {
        return res.status(404).json({
            message: "Comment not Found",
        });
    }
    db.comments.splice(index, 1);
    await createDB(db);
    res.status(204).end();
});

module.exports = router;
