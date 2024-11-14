const express = require('express')
const AuthorModel = require('../models/AuthorModel')
const BlogModel = require('../models/BlogModel')
const authorsRoute = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')


const internalStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'uploads')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExtension = file.originalname.split('.').pop()
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`)
    }
})

const upload = multer({ storage: internalStorage })

authorsRoute.post('/upload', upload.single('img'), async ( req, res, next ) => { //IMG = DA INSERIRE IL NOME DELL IMPUT DAL BACKEND
    try{
        const url = `${req.protocol}://${req.get('host')}`    //http o https = protocol/ :// HOST
        const imgUrl = req.file.filename
        res
            .status(200)
            .json({ img: `${ url }/uploads/${ imgUrl }`}) 
    } catch (e) {
        next(e)
    }
})


authorsRoute.get('/', async ( req, res ) => {
    try {
        const authors = await AuthorModel.find()
        if (authors.length === 0 ) {
            return res.status(404).send({
                message: 'No author found'
            })
        }
        res.status(200).send({
            statusCode: 200,
            authors
        })
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
})

authorsRoute.get("/:id", async ( req, res ) => {
    try {
        const authors = await AuthorModel.findById(req.params.id)
        res.status(200).send(authors)
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: e.message
        })
    }
})

authorsRoute.get("/:id/blogs", async ( req, res ) => {
    try {
        const author = await BlogModel.find({
            author: req.params.id,
        }).populate({ path: "author", select: ["name", "surname", "avatar"] })
        res.status(200).send( author )
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
})




authorsRoute.post('/create', async ( req, res ) => {
    try {
        const newAuthor = new AuthorModel(req.body)
        const savedAuthor = await newAuthor.save()
        res.status(201).send({
            statusCode: 201,
            message: 'Author saved successfully',
            savedAuthor
        })
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
})



authorsRoute.put('/update/:id', async ( req, res ) => {
    const { id: authorID } = req.params;
    try {
        const updatedAuthorData = req.body;
        const updatedAuthor = await AuthorModel.findByIdAndUpdate(
            authorID,
            updatedAuthorData,
            { new: true }
        );

        if (!updatedAuthor) {
            return res.status(404).send({
                statusCode: 404,
                message: `Author with ID ${authorID} not found`
            });
        }
        res.status(200).send({
            statusCode: 200,
            message: `User with ID ${authorID} updated successfully`,
            updatedAuthor
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: e.message,
          });
    }
})


authorsRoute.delete('/delete/:id', async ( req, res ) => {
    const { id: authorID } = req.params;
    try {
        await AuthorModel.findByIdAndDelete(
            authorID,
        )
        res.status(200).send({
            statusCode: 200,
            message: `Author with ID ${ authorID } deleted successfully`
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: e.message,
          });
    }
})



module.exports = authorsRoute