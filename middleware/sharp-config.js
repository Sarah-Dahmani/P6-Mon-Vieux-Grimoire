const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const compressImage =  (req, res, next) => {
    if(!req.file){return next()}

    const originalName = req.file.filename.split('.')[0]
    const fullOriginalName = req.file.filename
    const originalPath = req.file.path
    const ext = req.file.filename.split('.')[1]

    const outputName = originalName + Date.now() + '.webp'
    const outputPath = originalPath.replace(req.file.filename, outputName)

   // sharp.cache({ files : 0 })
    sharp(originalPath).webp({quality: 20}).toFile('back-end/images/'+ outputName)
    .then(() => {
        sharp.cache(false)

        req.file.path = outputPath
        req.file.filename = outputName
        
        fs.unlink(path.join('back-end/images/', fullOriginalName), (error) => {
            if(error){return console.log(error)}
        })

        next()
    })
    .catch((error) => {
        return next(error);
    })
    
}

module.exports = compressImage