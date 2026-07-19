import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minlength: [5, 'User name must be at least 5 characters long'],
        maxlength: [50, 'User name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'] //example@gmail.com
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minlength: [8, 'User password must be at least 8 characters long']
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;


// { name: 'John Chris', email: 'chris@example.com', password: 'password123', role: 'student' }