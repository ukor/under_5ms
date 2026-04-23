// import { MongoClient } from "mongodb";

// const uri = "mongodb://root:passwordRoot@localhost:27017/aka_database?authSource=admin";
// const client = new MongoClient(uri);

async function run() {
	try {
		// await client.connect();
		// const db = client.db("aka_database");

		console.log("Database seeded successfully!");
	} catch (e) {
		console.error("failed:", e);
	} finally {
		// await client.close();
	}
}

run();
