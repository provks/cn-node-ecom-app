import mongoose from 'mongoose';
// const { Schema } = mongoose;

export const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        minLength: [3, 'Name should be atleast 3 characters'],
        maxLength: [20, 'Name cannot be more than 20 characters']
    }, // String is shorthand for {type: String}
    email: { 
        type: String, 
        unique: true, 
        required: true,
        match: [/.+\@.+\../, "Please enter a valid email"],
    },
    password: { 
        type: String,
        validate: {
            validator: function(value) {
              return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value);
            },
            message: "Password should be between 8-12 characters with one special character"
            //  props => `${props.value} is not a valid phone number!`
          },
    },
    type: { type: String, enum: ['customer', 'seller', 'admin']},
});

export const User = mongoose.model('User', userSchema);