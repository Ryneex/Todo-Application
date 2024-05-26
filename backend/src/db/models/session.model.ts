import User from './user.model'
import { Schema, model, models, SchemaDefinitionProperty, type Model } from 'mongoose'
import { v4 } from 'uuid'
import { ISession } from '../../types/types'

const scema = new Schema({
    _id: {
        type: String,
        default: v4,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    expiresAt: Date,
} as SchemaDefinitionProperty)

const Session: Model<ISession> = models.Session || model('Session', scema)

export default Session
