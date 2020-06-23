const express = require('express')
const router = express.Router()

let MediaModel = require('../models/Media.model')
const { isLoggedIn } = require('../helpers/auth-helper'); // to check if user is loggedIn

router.get('/todos', (req, res) => {
     // TodoModel.find()
     //      .then((todos) => {
     //           res.status(200).json(todos)
     //      })
     //      .catch((err) => {
     //           res.status(500).json({
     //                error: 'Something went wrong',
     //                message: err
     //           })
     // })         
})

router.post('/create', isLoggedIn, (req, res) => {  
//     const {name, description, completed} = req.body;
//     console.log(req.body)
//     TodoModel.create({name: name, description: description, completed: completed})
//           .then((response) => {
//                res.status(200).json(response)
//           })
//           .catch((err) => {
//                res.status(500).json({
//                     error: 'Something went wrong',
//                     message: err
//                })
//           })  
})

router.get('/todos/:myId', isLoggedIn, (req, res) => {
//     TodoModel.findById(req.params.myId)
//      .then((response) => {
//           res.status(200).json(response)
//      })
//      .catch((err) => {
//           res.status(500).json({
//                error: 'Something went wrong',
//                message: err
//           })
//      }) 
})

router.delete('/todos/:id', isLoggedIn, (req, res) => {
//     TodoModel.findByIdAndDelete(req.params.id)
//           .then((response) => {
//                res.status(200).json(response)
//           })
//           .catch((err) => {
//                res.status(500).json({
//                     error: 'Something went wrong',
//                     message: err
//                })
//           })  
})

router.patch('/todos/:id', isLoggedIn, (req, res) => {
//     let id = req.params.id
//     const {name, description, completed} = req.body;
//     TodoModel.findByIdAndUpdate(id, {$set: {name: name, description: description, completed: completed}})
//           .then((response) => {
//                res.status(200).json(response)
//           })
//           .catch((err) => {
//                console.log(err)
//                res.status(500).json({
//                     error: 'Something went wrong',
//                     message: err
//                })
//           }) 
})

module.exports = router;