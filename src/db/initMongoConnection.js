import mongoose from 'mongoose';

export async function initMongoConnection() {
  const {
    MONGODB_URI,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_URL,
    MONGODB_DB,
  } = process.env;

  let uri = MONGODB_URI;

  if (!uri) {
    if (!MONGODB_URL || !MONGODB_DB) {
      throw new Error('Missing MongoDB env variables. Check .env');
    }

    const credentials =
      MONGODB_USER && MONGODB_PASSWORD
        ? `${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(
            MONGODB_PASSWORD,
          )}@`
        : '';

    uri = `mongodb+srv://${credentials}${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connection successfully established!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}
