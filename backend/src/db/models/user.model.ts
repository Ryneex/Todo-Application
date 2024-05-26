import mongoose, { Model } from 'mongoose'
import { IUser } from '../../types/types'

const schema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        password: {
            required: true,
            type: String,
        },
    } as { [key: string]: mongoose.SchemaDefinitionProperty },
    { timestamps: true }
)

const User: Model<IUser> = mongoose.models.User || mongoose.model('User', schema)

export default User
