import mongoose, { mongo } from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// an interface describes the properties
// that are required to craete a new ticket
interface TicketAttrs {
    title: string,
    price: number,
    userId: string,
}

// interface that describe the properties
// that a ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

// interface that describe the properties
// that a ticket Document has
interface TicketDoc extends mongoose.Document {
    title: string,
    price: number,
    userId: string,
    version: number,
}

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
},
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = doc._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema);




// type Prettify<T> = {
//     [k in keyof T]: T[k]
// } & {};

export { Ticket };