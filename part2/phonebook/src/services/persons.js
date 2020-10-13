const { default: Axios } = require("axios");
const baseUrl = "/api/persons";

const getAll = () => Axios.get(baseUrl).then(response => response.data);
const create = newContact =>
  Axios.post(baseUrl, newContact)
    .then(response => response.data)
    .catch(error => error.response.data);
const update = (id, newContact) =>
  Axios.put(`${baseUrl}/${id}`, newContact)
    .then(response => response.data)
    .catch(error => error.response.data);
const remove = id =>
  Axios.delete(`${baseUrl}/${id}`).then(response => response.data);

export default { getAll, create, update, remove };
