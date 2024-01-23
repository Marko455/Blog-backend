import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Unesite email'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Unesite lozinku'],
        minlenght: [6, 'Minimalni broj znakova je 6']
    }
})

userSchema.post('save', function(doc, next){
    console.log("Korisnik je kreiran je spremljen", doc);
    next();
})

const User = mongoose.model('user', userSchema);
export default User;