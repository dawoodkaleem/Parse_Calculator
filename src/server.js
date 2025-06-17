import http from "http";
import app from "./app.js"; // Note: "./app.js" with relative path and .js extension

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});