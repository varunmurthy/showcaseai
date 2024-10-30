import express from 'express';
import { z } from 'zod';
import db from '../db/index.js';

const router = express.Router();

const entrySchema = z.object({
  content: z.string(),
  date: z.string().datetime(),
  tasks: z.array(z.object({
    title: z.string(),
    completed: z.boolean()
  })),
  meetings: z.array(z.object({
    title: z.string(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    attendees: z.array(z.string())
  })),
  emails: z.array(z.object({
    subject: z.string(),
    sender: z.string(),
    summary: z.string()
  })),
  images: z.array(z.object({
    url: z.string().url(),
    caption: z.string().optional()
  }))
});

// Create journal entry
router.post('/', (req, res) => {
  try {
    const userId = req.user.id;
    const entry = entrySchema.parse(req.body);
    
    db.transaction(() => {
      // Insert journal entry
      const entryStmt = db.prepare(
        'INSERT INTO journal_entries (user_id, content, date) VALUES (?, ?, ?)'
      );
      const entryResult = entryStmt.run(userId, entry.content, entry.date);
      const entryId = entryResult.lastInsertRowid;
      
      // Insert tasks
      const taskStmt = db.prepare(
        'INSERT INTO tasks (entry_id, title, completed) VALUES (?, ?, ?)'
      );
      entry.tasks.forEach(task => {
        taskStmt.run(entryId, task.title, task.completed);
      });
      
      // Insert meetings
      const meetingStmt = db.prepare(
        'INSERT INTO meetings (entry_id, title, start_time, end_time, attendees) VALUES (?, ?, ?, ?, ?)'
      );
      entry.meetings.forEach(meeting => {
        meetingStmt.run(
          entryId,
          meeting.title,
          meeting.startTime,
          meeting.endTime,
          JSON.stringify(meeting.attendees)
        );
      });
      
      // Insert emails
      const emailStmt = db.prepare(
        'INSERT INTO emails (entry_id, subject, sender, summary) VALUES (?, ?, ?, ?)'
      );
      entry.emails.forEach(email => {
        emailStmt.run(entryId, email.subject, email.sender, email.summary);
      });
      
      // Insert images
      const imageStmt = db.prepare(
        'INSERT INTO images (entry_id, url, caption) VALUES (?, ?, ?)'
      );
      entry.images.forEach(image => {
        imageStmt.run(entryId, image.url, image.caption);
      });
    })();
    
    res.status(201).json({ message: 'Entry created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Error creating entry' });
    }
  }
});

// Get all entries for a user
router.get('/', (req, res) => {
  try {
    const userId = req.user.id;
    
    const entries = db.prepare(`
      SELECT 
        e.*,
        json_group_array(DISTINCT json_object(
          'id', t.id,
          'title', t.title,
          'completed', t.completed
        )) as tasks,
        json_group_array(DISTINCT json_object(
          'id', m.id,
          'title', m.title,
          'startTime', m.start_time,
          'endTime', m.end_time,
          'attendees', m.attendees
        )) as meetings,
        json_group_array(DISTINCT json_object(
          'id', em.id,
          'subject', em.subject,
          'sender', em.sender,
          'summary', em.summary
        )) as emails,
        json_group_array(DISTINCT json_object(
          'id', i.id,
          'url', i.url,
          'caption', i.caption
        )) as images
      FROM journal_entries e
      LEFT JOIN tasks t ON t.entry_id = e.id
      LEFT JOIN meetings m ON m.entry_id = e.id
      LEFT JOIN emails em ON em.entry_id = e.id
      LEFT JOIN images i ON i.entry_id = e.id
      WHERE e.user_id = ?
      GROUP BY e.id
      ORDER BY e.date DESC
    `).all(userId);
    
    // Parse JSON strings back to arrays
    const parsedEntries = entries.map(entry => ({
      ...entry,
      tasks: JSON.parse(entry.tasks),
      meetings: JSON.parse(entry.meetings),
      emails: JSON.parse(entry.emails),
      images: JSON.parse(entry.images)
    }));
    
    res.json(parsedEntries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching entries' });
  }
});

// Update journal entry
router.put('/:id', (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;
    const entry = entrySchema.parse(req.body);
    
    // Verify ownership
    const ownerCheck = db.prepare(
      'SELECT id FROM journal_entries WHERE id = ? AND user_id = ?'
    ).get(entryId, userId);
    
    if (!ownerCheck) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    db.transaction(() => {
      // Update entry
      db.prepare(
        'UPDATE journal_entries SET content = ?, date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).run(entry.content, entry.date, entryId);
      
      // Delete existing related records
      db.prepare('DELETE FROM tasks WHERE entry_id = ?').run(entryId);
      db.prepare('DELETE FROM meetings WHERE entry_id = ?').run(entryId);
      db.prepare('DELETE FROM emails WHERE entry_id = ?').run(entryId);
      db.prepare('DELETE FROM images WHERE entry_id = ?').run(entryId);
      
      // Insert updated records
      const taskStmt = db.prepare(
        'INSERT INTO tasks (entry_id, title, completed) VALUES (?, ?, ?)'
      );
      entry.tasks.forEach(task => {
        taskStmt.run(entryId, task.title, task.completed);
      });
      
      const meetingStmt = db.prepare(
        'INSERT INTO meetings (entry_id, title, start_time, end_time, attendees) VALUES (?, ?, ?, ?, ?)'
      );
      entry.meetings.forEach(meeting => {
        meetingStmt.run(
          entryId,
          meeting.title,
          meeting.startTime,
          meeting.endTime,
          JSON.stringify(meeting.attendees)
        );
      });
      
      const emailStmt = db.prepare(
        'INSERT INTO emails (entry_id, subject, sender, summary) VALUES (?, ?, ?, ?)'
      );
      entry.emails.forEach(email => {
        emailStmt.run(entryId, email.subject, email.sender, email.summary);
      });
      
      const imageStmt = db.prepare(
        'INSERT INTO images (entry_id, url, caption) VALUES (?, ?, ?)'
      );
      entry.images.forEach(image => {
        imageStmt.run(entryId, image.url, image.caption);
      });
    })();
    
    res.json({ message: 'Entry updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Error updating entry' });
    }
  }
});

// Delete journal entry
router.delete('/:id', (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;
    
    // Verify ownership
    const ownerCheck = db.prepare(
      'SELECT id FROM journal_entries WHERE id = ? AND user_id = ?'
    ).get(entryId, userId);
    
    if (!ownerCheck) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    // Delete entry (cascading delete will handle related records)
    db.prepare('DELETE FROM journal_entries WHERE id = ?').run(entryId);
    
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting entry' });
  }
});

export default router;