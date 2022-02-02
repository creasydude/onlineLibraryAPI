import mongoose from 'mongoose';

const librarySchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50
    },
    authorName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    publisherName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    bookCategory: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    bookDescription: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 500
    },
    bookBorrowedBy: {
        type: String, //nationID of holder
        default: "0000000000",
        minlength: 10,
        maxlength: 10
    },
    bookStatus: {
        type: String,
        default: "available", //available or borrowed
    },
    bookBorrowedDate: {
        type: Date,
        default: null,
    },
    bookReturnedDate: {
        type: Date,
        default: null,
    }
});

const Library = mongoose.model('Library', librarySchema);
export default Library;


