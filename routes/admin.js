import express from 'express';
import { addBook, editBook, removeBook, viewAllUsers, searchUser, searchBook, viewAllBooks, verrifyBorrows, verifyReturns } from '../controller/admin.js';
import { adminAuth } from '../middleware/userAuth.js';
const Router = express.Router();

Router.post('/addBook', adminAuth, addBook);
Router.post('/addBook', adminAuth, editBook);
Router.post('/addBook', adminAuth, removeBook);
Router.get('/allUsers', adminAuth, viewAllUsers);
Router.get('/allBooks', adminAuth, viewAllBooks);
Router.post('/searchUser', adminAuth, searchUser);
Router.post('/searchBook', adminAuth, searchBook);
Router.post('/verrifyBorrows', adminAuth, verrifyBorrows);
Router.post('/verifyReturns', adminAuth, verifyReturns)

export default Router;