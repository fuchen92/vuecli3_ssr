import axios from "axios"

export function fetchItem(id) {
	return axios.get(`http://localhost:8756/api/items/${id}`)
}

export function fetchItems() {
	return axios.get(`http://localhost:8756/api/items`)
}

export function addItem(item) {
	return axios.post(`http://localhost:8756/api/items`, item)
}
