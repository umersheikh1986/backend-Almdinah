import { mongoose } from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    ParentFirstName: {
      type: String,
      required: true,
      unique: true,
    },
    ParentlastName: {
      type: String,
      required: true,
      unique: true,
    },
    StreetAddress: {
      type: String,
      required: true,
      unique: true,
    },
    City: {
      type: String,
      required: true,
    },
    PostalCode: {
      type: String,
      required: true,
    },
    PhoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    StudentFirstName: {
      type: String,
      required: true,
      unique: true,
    },
    StudentLastName: {
      type: String,
      required: true,
      unique: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    YearOfEntry: {
      type: String,
      required: true,
    },
    WouldYouLikeToEnroll: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
