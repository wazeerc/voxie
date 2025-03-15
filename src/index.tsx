import { hydrate, prerender as ssr } from 'preact-iso';
import './style.css';

export function App() {
	return (
		<div>
			<h1>Hello, Preact!</h1>
		</div>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
