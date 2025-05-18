import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        // Profile fields (not required initially)
        userName: String,
        bio: String,
        mobile: String,
        gender: String,
        dob: Date,
        location: String,
        profilePic: String,
        isProfileComplete: {
          type: Boolean,
          default: false
        }
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', userSchema);
export default User;