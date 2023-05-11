export function getShibes(): Promise<string> {
	return fetch('http://shibe.online/api/shibes')
		.then(res => res.json())
		.then(data => data[0]);
}
