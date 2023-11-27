import { connect } from 'mongoose';



async function dbConnect() {
    try {
        await connect(process.env.MONGODB_URI!);
        console.log('MongoDB Connected');
    } catch (err) {
    }
}

export default dbConnect;