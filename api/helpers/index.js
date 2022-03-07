// const FileUpload = require('fileupload');
const fs = require('fs');



// const UploadFile = async(data, path) => {
//     try{
//         const image = data
//         if(!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
//         const newName = Date.now() + '.png'
//         uploadPath = path + newName
//         const moveFile = image.mv(uploadPath)

//         if(moveFile) return newName
//     }catch(error){
//         if(error) return error
//     }
// }


const UploadFile = async(data, path) => {
    try{
        const image = data
        if(!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
        const newName = Date.now() + '.png'
        uploadPath = path + newName
        const moveFile = image.mv(uploadPath)
        if(moveFile) return newName
    }catch(error) {
        if(error) return error
    }
}

module.exports = {
    UploadFile
};