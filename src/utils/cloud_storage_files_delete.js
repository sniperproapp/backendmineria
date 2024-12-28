
const { Storage } = require('@google-cloud/storage');
 
const { format } = require('util');
const env = require('../config/env')
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
 

const storage = new Storage({
    projectId: "sniperpro-eaa57",
    keyFilename: './serviceAccountKey.json'
});

const bucket = storage.bucket("gs://sniperpro-eaa57.appspot.com/");

/**
 * Subir el archivo a Firebase Storage
 * file objeto que sera almacenado en Firebase Storage
 */
module.exports = (  pathImage) => {
    return new Promise((resolve, reject) => {
        
        if (pathImage) {
            if (  pathImage != undefined) {

                //const httpsRef = storage.refFromURL(pathImage).fullPath;
             

               
                
                // Create a reference to the file to delete
                const desertRef = ref(storage, pathImage);
                
                // Delete the file
                deleteObject(desertRef).then(() => {
                    resolve  (console.log("eliminado"))
                  // File deleted successfully
                }).catch((error) => {
                    console.log(error)

                  // Uh-oh, an error occurred!
                });
 
               
            }
        }
    });
}