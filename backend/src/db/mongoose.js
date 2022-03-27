import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection_URL = process.env.MONGO_URL;
// console.log(connection_URL);

//function for checking database connection
const connectToMongo = async () => {
  // try {
  mongoose.connect(connection_URL, {
    useNewUrlParser: true,
    autoIndex: true,
    useUnifiedTopology: true,
  });
  console.log("connected to mongo successfully");
  // }
  // catch (error) {
  //   console.log(error);
  // }
};

// mongoose.connection.once("open", () => {
//   console.log("DB connected");
// });

export default connectToMongo;

//64DVP6vERx6zpcZP
// "mongodb+srv://admin:64DVP6vERx6zpcZP@cluster0.tygtm.mongodb.net/shopolon"

// "mongodb+srv://" + url.QueryEscape(username) + ":" +
// 		url.QueryEscape(password) + "@" + cluster +
// 		"/?authSource=" + authSource +
// 		"&authMechanism=" + authMechanism
