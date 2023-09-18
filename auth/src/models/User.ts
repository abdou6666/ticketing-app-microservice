import mongoose, { mongo } from "mongoose";

// an interface describes the properties
// that are required to craete a new user
interface UserAttrs {
    email: string,
    password: string;
}

// interface that describe the properties
// that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// interface that describe the properties
// that a user Document has
interface UserDoc extends mongoose.Document {
    email: string,
    password: string,
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

UserSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

const u = User.build({
    email: "abdou@gamil.com",
    password: "123"
});


// type Prettify<T> = {
//     [k in keyof T]: T[k]
// } & {};

export { User, };