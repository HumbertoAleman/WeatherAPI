import mongoose from 'mongoose'

const earthquakeSchema = new mongoose.Schema({
	magnitude: { type: Number, required: true },
	depth: { type: Number, required: true },
	location: { type: String, required: true },
	date: { type: Date, required: true },
});

export default mongoose.model('Earthquake', earthquakeSchema);
