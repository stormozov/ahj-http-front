const createRequest = async (options = {}) => {
  let response;

  try {
    const serverResponse = await fetch(options.url, options);
    response = await serverResponse.json();
  } catch (error) {
    response = [];
  }

  return response;
};

export default createRequest;
