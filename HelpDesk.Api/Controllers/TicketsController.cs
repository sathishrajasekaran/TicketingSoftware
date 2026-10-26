using HelpDesk.Api.Data;
using HelpDesk.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TicketsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/tickets
    [HttpGet]
    public async Task<ActionResult<List<Ticket>>> GetTickets()
    {
        var tickets = await _context.Tickets
            .AsNoTracking()
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return Ok(tickets);
    }

    // GET: api/tickets/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Ticket>> GetTicket(int id)
    {
        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
            return NotFound();

        return Ok(ticket);
    }

    // POST: api/tickets
    [HttpPost]
    public async Task<ActionResult<Ticket>> CreateTicket(Ticket ticket)
    {
        ticket.Id = 0;
        ticket.CreatedAt = DateTime.UtcNow;

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetTicket),
            new { id = ticket.Id },
            ticket);
    }

    // PUT: api/tickets/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTicket(int id, Ticket updatedTicket)
    {
        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
            return NotFound();

        ticket.Title = updatedTicket.Title;
        ticket.Description = updatedTicket.Description;
        ticket.CreatedBy = updatedTicket.CreatedBy;
        ticket.Priority = updatedTicket.Priority;
        ticket.Status = updatedTicket.Status;
        ticket.AssignedTo = updatedTicket.AssignedTo;

        await _context.SaveChangesAsync();

        return Ok();
    }

    // DELETE: api/tickets/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTicket(int id)
    {
        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
            return NotFound();

        _context.Tickets.Remove(ticket);
        await _context.SaveChangesAsync();

        return Ok();
    }
}