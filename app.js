require('dotenv').config();

const express = require("express");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing")

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
//----------------

//configuring Mail Chimp API
client.setConfig({
  apiKey: process.env.APIKEY,
  server: process.env.SERVER,
});


app.get("/",function(req, res){
  res.sendFile(__dirname+"/signup.html",__dirname+"/styles.css");
});

// app.get("/styles.css",function(req, res){
//   res.sendFile(__dirname+"/styles.css");
// });

app.post("/",function(req,res){
  const firstName = req.body.firstName;
  const lastName= req.body.lastName;
  const email = req.body.email;
  //const subscribingUser = {firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email}
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

//   const run = async () => {
//         const response = await client.lists.addListMember("b29bbff402", jsonData);
//         console.log(response); // (optional)
//   };
// run();


  const url = process.env.POST_LIST_URL;
  const options = {
    method: "post",
    auth:"user:"+process.env.APIKEY
  };

  const request = https.request(url, options, function(response){
    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html")
    } else{
      res.sendFile(__dirname+"/failure.html")
    }
    console.log(response.statusCode);

    // response.on("data", function(data){
    //   //console.log(JSON.parse(data));
    // });
  });

  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000");
});

app.post("/failure",function(req,res){
  res.redirect("/");
});
