import ErrorResponse from '../utils/ErrorResponse.js';
import SuccessResponse from '../utils/SuccessResponse.js';
import Library from '../models/Library.js';
import User from '../models/User.js';

export const addBook = async (req, res, next) => {
    const { bookName, authorName, publisherName, bookCategory, bookDescription } = req.body;
    if (!bookName || !authorName || !publisherName || !bookCategory || !bookDescription) return next(new ErrorResponse('Please provide all required fields', 400));
    try {
        const newBook = await Library.create({
            bookName,
            authorName,
            publisherName,
            bookCategory,
            bookDescription
        });
        SuccessResponse(res, 201, { message: "Book added successfully", newBook });
    } catch (err) {
        return next(err);
    }
}

export const removeBook = async (req, res, next) => {
    const { bookId } = req.body;
    if (!bookId) return next(new ErrorResponse('Please provide book id', 400));
    try {
        const book = await Library.findById(bookId);
        if (!book) return next(new ErrorResponse('Book not found', 404));
        await book.remove();
        SuccessResponse(res, 200, { message: "Book removed successfully", book });
    } catch (err) {
        return next(err);
    }
}

export const editBook = async (req, res, next) => {
    const { bookId, bookName, authorName, publisherName, bookCategory, bookDescription } = req.body;
    if (!bookId || !bookName || !authorName || !publisherName || !bookCategory || !bookDescription) return next(new ErrorResponse('Please provide all required fields', 400));
    try {
        const book = await Library.findById(bookId);
        if (!book) return next(new ErrorResponse('Book not found', 404));
        book.bookName = bookName;
        book.authorName = authorName;
        book.publisherName = publisherName;
        book.bookCategory = bookCategory;
        book.bookDescription = bookDescription;
        await book.save();
        SuccessResponse(res, 200, { message: "Book edited successfully", book });
    } catch (err) {
        return next(err);
    }
}

export const viewAllUsers = async (req, res, next) => {
    let { page, limit } = req.query;
    if (!page) page = 1;
    if (!limit) limit = 10;
    try {
        let users = await User.find({}, null, { skip: (page - 1) * limit, limit: parseInt(limit) });
        users = users.map((user, i) => {
            return {
                index: i + 1,
                _id: user._id,
                isAdmin: user.isAdmin,
                nationalID: user.nationalID,
                phoneNumber: user.phoneNumber
            }
        });
        const totalUsers = await User.countDocuments();
        SuccessResponse(res, 200, { totalUsers, users });
    } catch (err) {
        return next(err);
    }
}

export const searchUser = async (req, res, next) => {
    const { nationalID } = req.body;
    if (!nationalID) return next(new ErrorResponse('Please provide national id', 400));
    try {
        let user = await User.findOne({ nationalID });
        if (!user) return next(new ErrorResponse('User not found', 404));
        user = {
            _id: user._id,
            isAdmin: user.isAdmin,
            nationalID: user.nationalID,
            phoneNumber: user.phoneNumber
        }
        const books = await Library.find({ bookBorrowedBy: nationalID });
        SuccessResponse(res, 200, { user, books });
    } catch (err) {
        return next(err);
    }
}

export const searchBook = async (req, res, next) => {
    const { bookName, authorName, publisherName, bookCategory, bookBorrowedBy } = req.body;
    if (!bookName && !authorName && !publisherName && !bookCategory && !bookBorrowedBy) return next(new ErrorResponse('Please provide at least one search criteria', 400));
    try {
        let books = await Library.find({});
        if (bookName) books = books.filter(book => book.bookName.toLowerCase().includes(bookName.toLowerCase()));
        if (authorName) books = books.filter(book => book.authorName.toLowerCase().includes(authorName.toLowerCase()));
        if (publisherName) books = books.filter(book => book.publisherName.toLowerCase().includes(publisherName.toLowerCase()));
        if (bookCategory) books = books.filter(book => book.bookCategory.toLowerCase().includes(bookCategory.toLowerCase()));
        if (bookBorrowedBy) books = books.filter(book => book.bookBorrowedBy.includes(bookBorrowedBy));
        
        
        SuccessResponse(res, 200, { message: "Items found", books });
    } catch (err) {
        return next(err);
    }
}

export const viewAllBooks = async (req, res, next) => {
    let { page, limit } = req.query;
    if (!page) page = 1;
    if (!limit) limit = 10;
    try {
        let books = await Library.find({}, null, { skip: (page - 1) * limit, limit: parseInt(limit) });
        books = books.map((book, i) => {
            return {
                index: i + 1,
                _id: book._id,
                bookName: book.bookName,
                authorName: book.authorName,
                publisherName: book.publisherName,
                bookCategory: book.bookCategory,
                bookDescription: book.bookDescription,
                bookBorrowedBy: book.bookBorrowedBy,
                bookStatus : book.bookStatus,
                bookBorrowedDate : book.bookBorrowedDate,
                bookReturnedDate : book.bookReturnedDate
            }
        });
        const totalBooks = await Library.countDocuments();
        SuccessResponse(res, 200, { totalBooks, books });
    } catch (err) {
        return next(err);
    }
}

export const verrifyBorrows = async (req, res, next) => {
    const { nationalID , bookID } = req.body;
    if (!nationalID || !bookID) return next(new ErrorResponse('Please provide nationalID and bookID', 400));
    try {
        const book = await Library.findById(bookID);
        const user = await User.findOne({ nationalID });
        if (!user) return next(new ErrorResponse('User with nationalID not found', 404));
        if (!book) return next(new ErrorResponse('Book not found', 404));
        book.bookBorrowedBy = nationalID;
        book.bookStatus = "borrowed";
        book.bookBorrowedDate = new Date();
        book.bookReturnedDate = null;
        await book.save()
        SuccessResponse(res, 200, { book });
    } catch (err) {
        return next(err);
    }
}

export const verifyReturns = async (req, res, next) => {
    const { nationalID , bookID } = req.body;
    if (!nationalID || !bookID) return next(new ErrorResponse('Please provide nationalID and bookID', 400));
    try {
        const book = await Library.findById(bookID);
        const user = await User.findOne({ nationalID });
        if (!user) return next(new ErrorResponse('User with nationalID not found', 404));
        if (!book) return next(new ErrorResponse('Book not found', 404));
        book.bookBorrowedBy = "0000000000";
        book.bookStatus = "available";
        book.bookReturnedDate = new Date();
        book.bookBorrowedDate = null;
        await book.save()
        SuccessResponse(res, 200, { book });
    } catch (err) {
        return next(err);
    }
}