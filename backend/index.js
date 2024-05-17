

const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors(
    {
        origin:["https://abhushan1-frontend.vercel.app"],
        methods:["POST","GET"],
        credentials:true
    }
));

// Database Connection With MongoDB
// mongoose.connect("mongodb+srv://Akanksha:Akanksha@123@cluster0.jpqnrz5.mongodb.net/SHOPPING_CART");
mongoose.connect("mongodb+srv://Akanksha:Akanksha123@cluster0.qcpdz26.mongodb.net/mydatabase");





//Image Storage Engine 
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({ storage: storage })

app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})


// // Middleware to fetch user from database
const fetchuser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, "secret_ecom");
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

// // Schema for creating user model
const Users = mongoose.model("Users", {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// // Schema for creating Product
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    // new_price: {
    //     type: Number
    // },
    old_price: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

// Routes

app.get("/", (req, res) => {
    res.send("Root");
});

// // Login endpoint
app.post('/login', async (req, res) => {
   
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passCompare=req.body.password===user.password;
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }else{
       res.json({success:false,errors:"Wrong Password"}); 
    }
});

// // Signup endpoint
app.post('/signup', async (req, res) => {
    // Implementation
    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart={};
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data={
        user:{
            id:user.id
        }
    }
    const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token})

});



// // Fetch new collections
app.get("/newcollections", async (req, res) => {
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);

});

// // Fetch popular products in women category
app.get("/popularinwomen", async (req, res) => {
    let products=await Product.find({category:"women"});
    let popular_in_women=products.slice(0,4);
    res.send(popular_in_women);
});

// // Add product to cart
app.post('/addtocart', fetchuser, async (req, res) => {
    console.log("added",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
});

// // Remove product from cart
app.post('/removefromcart', fetchuser, async (req, res) => {
    console.log("removed",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
});

// // Get user's cart
app.post('/getcart', fetchuser, async (req, res) => {
    console.log("GetCart");
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
});

// // Add a new product
app.post("/addproduct", async (req, res) => {
    
    let products=await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;
    }else{
        id=1;
    }
    const product=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        // new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })

});


// // Remove a product
app.post("/removeproduct", async (req, res) => {
   await Product.findOneAndDelete({id:req.body.id});
   console.log("Removed");
   res.json({
    success:true,
    name:req.body.name
   })
});

// // Fetch all products
app.get("/allproducts", async (req, res) => {
    // Implementation
    let products=await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
});

app.listen(port, (error) => {
    if (!error) console.log("Server Running on port " + port);
    else console.log("Error : ", error);
});
