const express=require("express")
const bodyparser=require("body-parser")
const mongoose=require("mongoose");
const _=require("lodash");
//const { use } = require("express/lib/application");
const app=express();
app.use(bodyparser.urlencoded({extended:true}));
const items=["but food","cook food","eat food"];
app.use(express.static("public"));
app.set('view engine','ejs')
mongoose.connect("mongodb+srv://rango2405:karthik2405@cluster0.guaov.mongodb.net/todolistDB", { useNewUrlParser: true },function(error){
    if(error){
        console.log("error in creating connection",error);
    }
    else{
        console.log("successs has commas")
    }
});
const itemsSchema={
    name: String
};
const Item=mongoose.model("Item",itemsSchema);
const items1= new Item({
    name: "brush  "
});
const items2= new Item({
    name: "bath"
})
const items3= new Item({
    name: "do stuff"
});
const defaultItems=[items1,items2,items3];  
const listSchema={
    name:String,
    items:[itemsSchema]
    
}
const List=mongoose.model("List",listSchema);
// const defaultItems=[items1,items2,items3];
// Item.insertMany(defaultItems,function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("Suceess dont have fullstops");
//     }

// });
app.post('/', function(req, res){
    const itemname = req.body.newItem;
    const listname= req.body.list;
    const item=new Item({
        name: itemname
    })
    if(listname==="Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listname},function(err,foundList){
            foundList.items.push(item);
            foundList.save()
            res.redirect("/"+listname);

        });
    }
});
app.post('/delete',function(req,res){
    const checkeditemid=req.body.checkbox;
    const listname= req.body.listname;
    if(listname==="Today"){
        Item.findByIdAndRemove(checkeditemid,function(err){

            if(!err){
            
                console.log("successfully deleted checked"+checkeditemid);
                res.redirect("/");            
            }
            else{
                console.log(err)
            }
        });
    }
    else{
        List.findOneAndUpdate({name:listname},{$pull:{items:{_id:checkeditemid}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listname);
            }
        });
    }
    
})

app.get("/",function(req,res){
    Item.find({},function(err,foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Suceess dont have fullstops");
                }

            });
            res.redirect("/")
        }
        else{
            // let today=new Date();
            // let options={
            //     weekdat:"long",
            //     day:"numeric",
            //     month:"long"
            // };
            // let day =today.toLocaleDateString("en-US",options);

            res.render("list",{listTitle:"Today",newListItems:foundItems});
        }
        
});

app.get("/:customeListName",function(req,res){
    const customeListName=_.capitalize(req.params.customeListName);
    List.findOne({name:customeListName},function(err,foundList){
        if(!err){
            if(!foundList){
                //newlist
                const list =new List({
                    name:customeListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+customeListName)
            }else{
                res.render("list",{listTitle:foundList.name,newListItems:foundList.items})
            }
        }

    });
    const list =new List({
        name:customeListName,
        items:defaultItems
    });
    list.save();
    
})

    // let today=new Date();
    // let options={
    //     weekdat:"long",
    //     day:"numeric",
    //     month:"long"
    // };
    // let day =today.toLocaleDateString("en-US",options);
    // res.render("list",{kindofDay:day,newListItems:items});
    
});

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://rango:<karthik@2405>@rango.aialv.mongodb.net/Todolist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("todolistDB").collection("items");
  // perform actions on the collection object
  client.close();
});

let port= process.env.PORT;
if(port==null || port==""){
    port=3000;
}   
app.use(express.static("public"));
app.listen(port,function(){
    console.log("Server is running on port 3000");
});