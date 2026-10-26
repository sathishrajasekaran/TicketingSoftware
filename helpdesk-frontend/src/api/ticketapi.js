const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5284"
).replace(/\/$/, "");
const API_URL = `${API_BASE_URL}/api/Tickets`;

async function requestTickets(options) {
  let response;

  try {
    response = await fetch(API_URL, options);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Unable to connect to the Help Desk API at ${API_URL}. Make sure the API is running.`,
        { cause: error },
      );
    }

    throw error;
  }

  return response;
}

export async function getTickets() {
  const response = await requestTickets();
  if (!response.ok) {
    throw new Error(`Failed to load tickets: ${response.status}`);
  }

  return response.json();
}

export async function createTicket(ticket) {
  const response = await requestTickets({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to create ticket: ${response.status}`);
  }

  return response.json();
}