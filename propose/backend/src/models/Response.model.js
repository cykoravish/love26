import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Anonymous'
    },
    response: {
        type: String,
        enum: ['yes', 'no', 'maybe'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    otherEmail: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Response = mongoose.model('Response', responseSchema);

export default Response;
