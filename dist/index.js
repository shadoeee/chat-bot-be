import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
// app.get("/", (req, res, next) => {
//   return res.send("Hello Man");
// });
const PORT = process.env.PORT || 5000;
//connection and listeners
connectToDatabase().then(() => {
    app.listen(PORT, () => console.log("Server is Active Now!!!"));
})
    .catch((err) => console.log(err));
//# sourceMappingURL=index.js.map