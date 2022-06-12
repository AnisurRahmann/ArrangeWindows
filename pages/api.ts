export const get = async (endpoint: string) => {
  const response = await fetch(`/api/${endpoint}`);
  return response.json();
};

export const post = async (endpoint: string, data: object) => {
  const response = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  const res = await response.json();
  return res;
};
