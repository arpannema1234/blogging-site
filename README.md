# Blogging Site

A full-featured blogging platform where users can create, read, update, and delete blog posts. Users can also comment on posts and upvote or downvote them.

## Features

- User authentication and authorization
- Create, read, update, and delete blog posts
- Comment on blog posts
- Upvote and downvote blog posts
- Search for blog posts
- Upload images for blog posts using Cloudinary

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: Firebase Authentication
- **File Storage**: Cloudinary
- **Frontend**: React (Not included in this repository)
- **Other**: Multer (for file uploads), CORS, dotenv

## Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

NODE_ENV=development

PORT=8080

MONGO_URL=your_mongodb_url

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ORIGIN1=your_first_allowed_origin

ORIGIN2=your_second_allowed_origin

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/blogging-site.git
   cd blogging-site
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up Firebase**:

   - Create a Firebase project.
   - Download the `credentials.json` file from Firebase and place it in the root of your project.

4. **Set up environment variables**:

   - Create a `.env` file and add your environment variables as specified above.

5. **Run the application**:
   ```bash
   npm start
   ```

## API Endpoints

### User Endpoints

- **Create a new user**: `POST /api/user`

  ```json
  {
    "username": "john_doe",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
  ```

- **Get user and their blogs**: `GET /api/user`

### Blog Endpoints

- **Get all blogs**: `GET /api/blogs?pageNumber=1`
- **Search blogs**: `GET /api/blog/search?q=query`
- **Get a single blog**: `GET /api/blog/:blogid`
- **Create a new blog**: `POST /api/blogs` (multipart/form-data)
  - Fields: `title`, `content`
  - File: `file`
- **Delete a blog**: `DELETE /api/blog/:blogid`
- **Add a comment**: `POST /api/blog/:blogid/comment`
  ```json
  {
    "comment": "This is a comment."
  }
  ```
- **Upvote a blog**: `PUT /api/blog/:blogid/upvote`
- **Downvote a blog**: `PUT /api/blog/:blogid/downvote`

## Error Handling

Errors are handled using try-catch blocks. In case of an error, a response with status code `500` and an error message is returned.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
