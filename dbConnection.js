import mongoose from "mongoose";

export const dbConnection = () =>{
    mongoose
    .connect(process.env.MONGO_URI,{
        dbName: "FUTSAL"

    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch((err) => {
        console.log(`some error occured while connecting to the database: ${err}`);
    });
};