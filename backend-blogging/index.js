require("dotenv").config();
const express = require("express");
const fs = require("fs");
const admin = require("firebase-admin");
const cors = require("cors");
const mongoose = require("mongoose");
const Blogs = require("./model");
const Users = require("./userModel");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const app = express();
const bodyParser = require("body-parser");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const credentials = JSON.parse(fs.readFileSync("./credentials.json"));
admin.initializeApp({ credential: admin.credential.cert(credentials) });

const upload = multer({ dest: "uploads/" });

const prodOrigins = [process.env.ORIGIN1, process.env.ORIGIN2];
const devOrigins = ["http://localhost:5173"];
const allowedOrigins =
  process.env.NODE_ENV === "production" ? prodOrigins : devOrigins;
console.log(allowedOrigins);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      console.log(origin);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Origin not allowed by CORS"), false);
      }
    },
  })
);

app.use(async (req, res, next) => {
  const { authtoken } = req.headers;
  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      return res.sendStatus(400);
    }
  }
  req.user = req.user || {};
  next();
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error Connecting to MongoDB:", error);
  });

async function getUsername(email) {
  const user = await Users.findOne({ email });
  return user.username;
}

app.post("/api/user", async (req, res) => {
  const { username, name, email } = req.body;
  try {
    const newUser = new Users({ username, name, email });
    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/blogs", async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    console.log("Listening to /api/blogs");
    const blogs = await Blogs.aggregate([
      {
        $project: {
          title: 1,
          username: 1,
          content: { $substr: ["$content", 0, 1000] },
          images: 1,
          _id: 1,
        },
      },
      { $skip: pageNumber * 5 - 5 },
      { $limit: 5 },
    ]);
    res.json(blogs);
  } catch (e) {
    console.error("Unknown Error Occurred:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/blog/search", async (req, res) => {
  const searchq = req.query.q;
  try {
    const blogs = await Blogs.aggregate([
      {
        $project: {
          title: 1,
          username: 1,
          content: { $substr: ["$content", 0, 200] },
          images: 1,
          _id: 1,
        },
      },
      {
        $match: {
          $or: [
            { title: { $regex: searchq, $options: "i" } },
            { content: { $regex: searchq, $options: "i" } },
          ],
        },
      },
    ]);
    res.status(200).json(blogs);
  } catch (err) {
    console.error("Error occurred during search:", err);
    res.status(400).json({ message: "Something went wrong" });
  }
});

app.get("/api/blog/:blogid", async (req, res) => {
  const { blogid } = req.params;
  const { uid } = req.user;
  try {
    const blogDocument = await Blogs.findOne({ _id: blogid });
    if (blogDocument) {
      let { upvoteIds, downvoteIds, ...newBlog } = blogDocument.toObject();
      downvoteIds = downvoteIds || [];
      upvoteIds = upvoteIds || [];
      newBlog = { ...newBlog, canDownvote: true, canUpvote: true };
      newBlog.canDownvote = uid && !downvoteIds.includes(uid);
      newBlog.canUpvote = uid && !upvoteIds.includes(uid);
      res.status(200).json(newBlog);
    } else {
      res.status(404).json({ message: "Blog does not exist" });
    }
  } catch (e) {
    console.error("Error fetching blog:", e);
    res.status(500).json({ message: "Bad request" });
  }
});

app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.sendStatus(400);
  }
});

app.get("/api/user", async (req, res) => {
  const { email } = req.user;
  try {
    const user = await Users.findOne({ email });
    const blogs = await Blogs.find({ username: user.username });
    const selectedField = blogs.map((blog) => ({
      title: blog.title,
      images: blog.images,
      _id: blog._id,
    }));
    res.status(201).json({ user, blogs: selectedField });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/blogs", upload.single("file"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const file = req.file;
    const { email } = req.user;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "Blog_Thumnail",
    });

    const username = await getUsername(email);
    const blog = new Blogs({
      title,
      content,
      images: result.secure_url,
      username,
      upvotes: 0,
      downvotes: 0,
      comments: [],
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/blog/:blogid", async (req, res) => {
  try {
    const { blogid } = req.params;
    const { email } = req.user;
    const username = await getUsername(email);
    const response = await Blogs.deleteOne({ _id: blogid, username });
    if (response.deletedCount === 1) {
      res.status(201).json({ message: "Deleted Successfully" });
    } else {
      res.status(401).json({ message: "Cannot Delete Blog" });
    }
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// app.post("/api/edit-blog/:blogid", upload.single("file"),async (req, res) => {

// })
app.post("/api/blog/:blogid/comment", async (req, res) => {
  const { blogid } = req.params;
  const { comment } = req.body;
  const { email } = req.user;
  try {
    const username = await getUsername(email);
    const response = await Blogs.findOneAndUpdate(
      { _id: blogid },
      { $push: { comments: { comment, user: username } } },
      { new: true }
    );
    res.status(200).json(response);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server Error: Cannot Add Comment" });
  }
});

app.put("/api/blog/:blogid/upvote", async (req, res) => {
  const { blogid } = req.params;
  const { uid } = req.user;
  try {
    const blog = await Blogs.findOne({ _id: blogid });
    if (blog) {
      const upvoteIds = blog.upvoteIds || [];
      const canUpvote = !upvoteIds.includes(uid);
      if (canUpvote) {
        const downvoted = blog.downvoteIds.includes(uid);
        let changes = { $inc: { upvotes: 1 }, $push: { upvoteIds: uid } };
        if (downvoted) {
          changes = {
            ...changes,
            $inc: { downvotes: -1 },
            $pull: { downvoteIds: uid },
          };
        }
        let updatedBlog = await Blogs.findOneAndUpdate(
          { _id: blogid },
          changes,
          { new: true }
        );
        updatedBlog = updatedBlog.toObject();
        updatedBlog.canDownvote = true;
        updatedBlog.canUpvote = false;
        res.json(updatedBlog);
      } else {
        let updatedBlog = await Blogs.findOneAndUpdate(
          { _id: blogid },
          { $inc: { upvotes: -1 }, $pull: { upvoteIds: uid } },
          { new: true }
        );
        updatedBlog = updatedBlog.toObject();
        updatedBlog.canDownvote = true;
        updatedBlog.canUpvote = true;
        res.json(updatedBlog);
      }
    } else {
      res.status(404).json({ message: "Blog does not exist" });
    }
  } catch (err) {
    console.error("Error upvoting blog:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/api/blog/:blogid/downvote", async (req, res) => {
  const { blogid } = req.params;
  const { uid } = req.user;
  try {
    const blog = await Blogs.findOne({ _id: blogid });
    if (blog) {
      const downvoteIds = blog.downvoteIds || [];
      const canDownvote = !downvoteIds.includes(uid);
      if (canDownvote) {
        const upvoted = blog.upvoteIds.includes(uid);
        let changes = { $inc: { downvotes: 1 }, $push: { downvoteIds: uid } };
        if (upvoted) {
          changes = {
            ...changes,
            $inc: { upvotes: -1 },
            $pull: { upvoteIds: uid },
          };
        }
        let updatedBlog = await Blogs.findOneAndUpdate(
          { _id: blogid },
          changes,
          { new: true }
        );
        updatedBlog = updatedBlog.toObject();
        updatedBlog.canDownvote = false;
        updatedBlog.canUpvote = true;
        res.json(updatedBlog);
      } else {
        let updatedBlog = await Blogs.findOneAndUpdate(
          { _id: blogid },
          { $inc: { downvotes: -1 }, $pull: { downvoteIds: uid } },
          { new: true }
        );
        updatedBlog = updatedBlog.toObject();
        updatedBlog.canDownvote = true;
        updatedBlog.canUpvote = true;
        res.json(updatedBlog);
      }
    } else {
      res.status(404).json({ message: "Blog does not exist" });
    }
  } catch (err) {
    console.error("Error downvoting blog:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
