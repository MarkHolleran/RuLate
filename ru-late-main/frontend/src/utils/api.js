// Constant containing REST API URL from .env
exports.url = process.env.REACT_APP_REST_API_URL;

// Simplified API call function using Fetch API
exports.call = (input, dataFunc, errFunc) => {
  let status;
  // Stores status code of response in status, handles response in dataFunc, handles errors in errFunc
  fetch(input.url, input.options)
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then(
      (data) => dataFunc(status, data),
      (err) => errFunc(err)
    );
};
