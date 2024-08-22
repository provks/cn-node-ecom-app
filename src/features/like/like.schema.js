import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'docModel'
    },
    docModel: {
        type: String,
        required: true,
        enum: ['Product', 'Category']
    }
});

likeSchema.pre('save', function(next) {
    // do stuff
    console.log("We are about to save new like!")
    next();
  });
likeSchema.pre('save', function(next) {
    // do stuff
    console.log("lalala")
    next();
  });

likeSchema.post('save', function(doc) {
    console.log('%s has been initialized from the db', doc);
  });


likeSchema.pre('find', function(next) {
    // do stuff
    console.log("Retreiving likes from DB!")
    next();
});

likeSchema.post('find', function(docs) {
    console.log('After finding the docs', docs);
  });

const Like = mongoose.model('Like', likeSchema);
export default Like;