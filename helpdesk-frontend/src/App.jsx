
import { useEffect, useState } from "react";
import { getTickets, createTicket } from "./api/ticketapi";
import "./App.css";

const emptyForm = {
  title: "",
  description: "",
  createdBy: "",
  priority: "Medium",
  status: "Open",
  assignedTo: "",
};

function App() 
{
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadTickets() {
    setLoading(true);
    setError("");

    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      await createTicket({
        ...form,
        assignedTo: form.assignedTo.trim() || null,
      });

      setForm({ ...emptyForm });
      setMessage("Ticket created successfully.");
      await loadTickets();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container">
      <h1>Help Desk Ticket Management</h1>

      <section className="panel">
        <h2>Create a Ticket</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={150}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength={2000}
            required
          />

          <label htmlFor="createdBy">Created By</label>
          <input
            id="createdBy"
            name="createdBy"
            value={form.createdBy}
            onChange={handleChange}
            maxLength={100}
            required
          />

          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <label htmlFor="assignedTo">Assigned To (optional)</label>
          <input
            id="assignedTo"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            maxLength={100}
          />

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Create Ticket"}
          </button>
        </form>
      </section>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <section className="panel">
        <div className="list-heading">
          <h2>Ticket List</h2>
          <button type="button" onClick={loadTickets}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading tickets...</p>
        ) : !error && tickets.length === 0 ? (
          <p>No tickets found. Create your first ticket above.</p>
        ) : (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <article className="ticket" key={ticket.id}>
                <h3>#{ticket.id} — {ticket.title}</h3>
                <p>{ticket.description}</p>
                <p><strong>Created by:</strong> {ticket.createdBy}</p>
                <p><strong>Priority:</strong> {ticket.priority}</p>
                <p><strong>Status:</strong> {ticket.status}</p>
                <p>
                  <strong>Assigned to:</strong>{" "}
                  {ticket.assignedTo || "Unassigned"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
