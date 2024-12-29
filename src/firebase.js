import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyAbt_lxzvtGwWq-mdojmi7XE_0EduYjsPA',
	authDomain: 'task-ebb5d.firebaseapp.com',
	projectId: 'task-ebb5d',
	storageBucket: 'task-ebb5d.firebasestorage.app',
	messagingSenderId: '566355004495',
	appId: '1:566355004495:web:9d6aec4e555cf1090eae3a',
	databaseURL: 'https://task-ebb5d-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
