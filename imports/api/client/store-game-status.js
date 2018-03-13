function storeGameStatus(localStorageKey, data) {
	try {
		let storedData = JSON.parse(localStorage.getItem(localStorageKey));
		Object.keys(data).map((key) => {
			storedData[key] = data[key];
		});
		localStorage.setItem(localStorageKey, JSON.stringify(storedData));

		return true;
	} catch (err) {
		return err;
	}
}

export default storeGameStatus;
