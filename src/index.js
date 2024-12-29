import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { Server } from './JSONServer';
import { FirebaseServer } from './FirebaseTask';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
		{/* <App /> */}
		{/* <Server /> */}
		<FirebaseServer />
	</React.StrictMode>,
);
