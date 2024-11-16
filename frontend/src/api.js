const isRunningInDocker = () => {
  try {
    return require("fs").existsSync("/.dockerenv");
  } catch {
    return false;
  }
};

const API_URL = isRunningInDocker()
  ? window.location.origin
  : "http://localhost:80";

export async function fetchItems() {
  const response = await fetch(API_URL + '/api/items', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

export async function addItem(name) {
  const response = await fetch(API_URL + '/api/items', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return response.json();
}
