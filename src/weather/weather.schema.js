import mongoose from 'mongoose'

const weatherSchema = new mongoose.Schema({
	id: { type: String, required: true },
    city: { type: String, required: true },
	temperature: { type: Number, required: true },
	humidity: { type: Number, required: true },
	condition: {
        type: String,
        enum: ['Soleado', 'Nublado', 'Lluvioso', 'Tormenta'] 
    }
});

export default mongoose.model('Weather', weatherSchema);