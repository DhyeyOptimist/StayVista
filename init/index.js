const mongoose = require("mongoose");
const { data: initdata } = require("./data");
const Listing = require("../models/listing.js") //model ne require kariyu


const MONGO_URL = "mongodb://127.0.0.1:27017/stayvista";

main()
    .then(() =>{
        console.log("connected  to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {

    await mongoose.connect(MONGO_URL);
    };

    const initDB = async () => {
        try {
            await Listing.deleteMany({});
            await Listing.insertMany(initdata);
            console.log("Data inserted successfully");
        } catch (error) {
            console.error("Error inserting data:", error);
        }
    };

initDB();