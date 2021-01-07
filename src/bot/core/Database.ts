import { MongoClient } from 'mongodb';

interface DBOptions {
	useNewUrlParser: boolean;
	useUnifiedTopology: boolean;
}

class MongoDB extends MongoClient {

	public constructor(options: DBOptions) {
		super(process.env.MONGODB!, options);
	}

}

export { MongoDB };
