const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../modules/listing.js");

// connection with database
const mongo_Url='mongodb://127.0.0.1:27017/wonderlust';
async function main(){
    await mongoose.connect(mongo_Url);
}

main().then(()=>{
    console.log("connection succesful");
})
.catch((err)=>{
    console.log(err)
});   // coonection part end here

const savedata= async()=>{
      await Listing.deleteMany({});
      initdata.data=initdata.data.map((obj)=>({...obj,owner:'68ee9bda2dfd0eac6e5dc8d6'}));
      
      await Listing.insertMany(initdata.data);
      console.log("array saved");
}

savedata();