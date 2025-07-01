import mongoose from 'mongoose'

const earthquakeSchema = new mongoose.Schema({
	id: { type: String, required: true },
	magnitude: { type: Number, required: true, min: [0, 'Magnitude cannot be a negative number, got {VALUE}'] },
	depth: { type: Number, required: true, min: [0, 'Depth cannot be a negative number, got {VALUE}'] },
	location: { type: String, required: true },
	date: { type: Date, required: true },
});

export default mongoose.model('Earthquake', earthquakeSchema);
