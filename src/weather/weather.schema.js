import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator';

const weatherSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
    city: { type: String, required: true },
	temperature: { type: Number, required: true },
	humidity: { type: Number, required: true },
	condition: {
        type: String,
        enum: ['Soleado', 'Nublado', 'Lluvioso', 'Tormenta'],
        required: true
    }
});

weatherSchema.plugin(mongooseUniqueValidator)

export default mongoose.model('Weather', weatherSchema);