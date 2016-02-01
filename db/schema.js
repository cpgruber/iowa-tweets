var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI||"mongodb://localhost/iowa");

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId

var TweetSchema = new Schema({
  createdAt: Date,
  text: String,
  geo: Array,
  user: String
})

mongoose.model("Tweet", TweetSchema);
