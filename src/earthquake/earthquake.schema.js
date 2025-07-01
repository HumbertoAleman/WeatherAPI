import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator';

const earthquakeSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	magnitude: { type: Number, required: true, min: [0, 'Magnitude cannot be a negative number, got {VALUE}'] },
	depth: { type: Number, required: true, min: [0, 'Depth cannot be a negative number, got {VALUE}'] },
	location: { type: String, required: true },
	date: { type: Date, required: true },
});
earthquakeSchema.plugin(mongooseUniqueValidator)

export default mongoose.model('Earthquake', earthquakeSchema);
