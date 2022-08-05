const router = require("express").Router();
const { publicPosts, privatePosts } = require("./models/post");
const checkAuth = require("./middleware/checkAuth");
const Post = require("./models/post");
const activeUser = require("./middleware/activeUser");

router.get("/public", (req, res) => {
    res.json(publicPosts);
});
router.get("/new", activeUser, (req, res) => {
    res.render("new_post", { user: req.user });
});
router.get("/", activeUser, async (req, res) => {
    let posts = await Post.find({});
    res.render("all", { posts: posts, user: req.user });
});

router.post("/new", checkAuth, async (req, res) => {
    console.log(req.user, req.body);
    const post = new Post({
        body: req.body.form,
        author: req.user.username,
        timestamp: Date.now(),
    });
    try {
        await post.save();
        res.redirect("/posts");
    } catch (e) {
        console.error(e);
    }
});

router.get("/private", checkAuth, (req, res) => {
    res.send(`You are logged in as ${req.user.username}`);
});

module.exports = router;
