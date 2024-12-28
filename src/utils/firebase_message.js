 
 
module.exports = ( data) => {
require('dotenv').config()
    var admin = require("firebase-admin");
    var path =__dirname.replace(/\\/g, '/')+"/serviceAccountKey.json"
    path=path.replace("dist/utils", '') 
    var serviceAccount = require(path);
 
    console.log( path)
    
if (!admin.apps.length) {
admin.initializeApp({
  credential: admin.credential.cert( serviceAccount)
});
}



  

  admin.messaging().sendEachForMulticast({
      tokens:data.tokens
       ,notification:{
        
          title:data.title,
          body:data.body
      }

          }).then((response)=>{
    
              console.log('ok')
          }).catch((error)=>{
              console.log(error) 
          })

}