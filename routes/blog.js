const express = require('express')
const BlogModel = require('../models/BlogModel')
const blogs = express.Router()

blogs.get('/', async ( req, res ) => {
    try {
        const blogPosts = await BlogModel.find()
        if ( blogPosts.length === 0 ) {
            return res.status(404).send({
                statusCode: 404,
                message: 'No post found'
            })
        }
        res.status(200).send({
            statusCode: 200,
            blogPosts
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: e.message
        })
    }
})

blogs.get('/:id', async ( req, res ) => {
    try {
        const blogPost = await BlogModel.findById(req.params.id)
        if (!blogPost) {
            res.status(404).send({
                statusCode: 404,
                message: 'Post not found'
            })
        }
        res.send({ 
            blogPost
        })
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
})



blogs.post('/create', async ( req, res ) => {
    try {
        const newPost = new BlogModel(req.body)
        const savedPost = await newPost.save()

        res.status(201).send({
            statusCode: 201,
            message: 'Post saved successfully',
            savedPost,
        })
    } catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
})

blogs.put('/update/:id', async ( req, res ) => {
    const { id: postID } = req.params;
    try {
        const updatedPostData = req.body;
        const updatedPost = await BlogModel.findByIdAndUpdate(
            postID,
            updatedPostData,
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).send({
                statusCode: 404,
                message: `Post with ID ${ postID } not found`
            });
        }
        res.status(200).send({
            statusCode: 200,
            message: `Post with ID ${ postID } updated successfully`,
            updatedPost
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: e.message,
          });
    }
})


blogs.delete('/delete/:id', async ( req, res ) => {
    const { id: postID } = req.params;
    try {
        await BlogModel.findByIdAndDelete(
            postID
        )
        res.status(200).send({
            statusCode: 200,
            message: `Post with ID ${ postID } deleted successfully`
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: e.message,
          });
    }
})


module.exports = blogs