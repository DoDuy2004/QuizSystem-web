import './index.css';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import routes from './configs/routesConfig';

/**
 * The root element of the application.
 */
const container = document.getElementById('root');

if (!container) {
	throw new Error('Failed to find the root element');
}

// mockSetup().then(() => {
// 	/**
// 	 * The root component of the application.
// 	 */

// });

const root = createRoot(container, {
	onUncaughtError: (error, errorInfo) => {
		console.error('UncaughtError error', error, errorInfo.componentStack);
	},
	onCaughtError: (error, errorInfo) => {
		console.error('Caught error', error, errorInfo.componentStack);
	}
});

const router = createBrowserRouter(routes);

root.render(<RouterProvider router={router} />);