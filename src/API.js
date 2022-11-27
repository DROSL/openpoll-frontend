const API_BASE = "/api";

class API {
	static fetch(endpoint, method, body) {
		return fetch(API_BASE + endpoint, {
			method: method || "GET",
			...(body && { body: JSON.stringify(body) }),
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
	}

	static createUrl(endpoint) {
		return API_BASE + endpoint;
	}
}

export default API;
