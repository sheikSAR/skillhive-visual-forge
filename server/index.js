
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '9688656667',
  database: 'see'
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to MySQL database:', err);
  });

// Auth Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, email, password, accountType = "client" } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM sign_up WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user into database
    const [result] = await pool.query(
      'INSERT INTO sign_up (name, email, password, is_freelancer) VALUES (?, ?, ?, ?)',
      [fullName, email, hashedPassword, accountType === 'freelancer' ? 1 : 0]
    );
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: result.insertId,
        name: fullName,
        email: email,
        is_freelancer: accountType === 'freelancer'
      }
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user from database
    const [users] = await pool.query(
      'SELECT * FROM sign_up WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    // Return user data
    res.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_freelancer: !!user.is_freelancer,
        is_admin: email === 'adminkareskillhive@klu.ac.in'
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Project Routes
app.get('/api/projects', async (req, res) => {
  try {
    const [projects] = await pool.query('SELECT * FROM projects');
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/projects/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const [projects] = await pool.query(
      'SELECT * FROM projects WHERE client_id = ? ORDER BY created_at DESC',
      [clientId]
    );
    res.json(projects);
  } catch (error) {
    console.error('Error fetching client projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, budget, deadline, category, skills, client_id } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO projects (title, description, budget, deadline, category, skills, client_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [title, description, budget, deadline, category, JSON.stringify(skills), client_id, 'open']
    );
    
    res.status(201).json({ 
      message: 'Project created successfully',
      project: {
        id: result.insertId,
        title,
        description,
        budget,
        deadline,
        category,
        skills,
        client_id,
        status: 'open'
      }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/projects/:projectId/status', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;
    
    await pool.query(
      'UPDATE projects SET status = ? WHERE id = ?',
      [status, projectId]
    );
    
    res.json({ message: `Project status updated to ${status}` });
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Application Routes
app.post('/api/applications', async (req, res) => {
  try {
    const { project_id, user_id, cover_letter } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO applications (project_id, user_id, cover_letter, status, created_at) VALUES (?, ?, ?, ?, NOW())',
      [project_id, user_id, cover_letter, 'pending']
    );
    
    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        id: result.insertId,
        project_id,
        user_id,
        cover_letter,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const [applications] = await pool.query(`
      SELECT a.*, p.title as project_title, s.name as user_name, s.email as user_email
      FROM applications a
      JOIN projects p ON a.project_id = p.id
      JOIN sign_up s ON a.user_id = s.id
    `);
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/applications/projects', async (req, res) => {
  try {
    const projectIds = req.query.projectId;
    
    if (!projectIds) {
      return res.status(400).json({ error: 'Project IDs are required' });
    }
    
    // Handle both single ID and array of IDs
    const ids = Array.isArray(projectIds) ? projectIds : [projectIds];
    
    // Use placeholders for each ID
    const placeholders = ids.map(() => '?').join(',');
    
    const [applications] = await pool.query(`
      SELECT a.*, p.title as project_title, s.name as user_name, s.email as user_email
      FROM applications a
      JOIN projects p ON a.project_id = p.id
      JOIN sign_up s ON a.user_id = s.id
      WHERE a.project_id IN (${placeholders})
    `, ids);
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching project applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.query(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, id]
    );
    
    // If application is approved, update project status to assigned
    if (status === 'approved') {
      const [applications] = await pool.query(
        'SELECT project_id FROM applications WHERE id = ?',
        [id]
      );
      
      if (applications.length > 0) {
        await pool.query(
          'UPDATE projects SET status = ? WHERE id = ?',
          ['assigned', applications[0].project_id]
        );
      }
    }
    
    res.json({ message: `Application ${status} successfully` });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User management routes
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, is_freelancer FROM sign_up WHERE email != ?',
      ['adminkareskillhive@klu.ac.in']
    );
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/freelancers', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT * FROM sign_up WHERE email != ? AND is_freelancer = 0',
      ['adminkareskillhive@klu.ac.in']
    );
    res.json(users);
  } catch (error) {
    console.error('Error fetching freelancer applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:userId/freelancer-status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_freelancer } = req.body;
    
    await pool.query(
      'UPDATE sign_up SET is_freelancer = ? WHERE id = ?',
      [is_freelancer, userId]
    );
    
    res.json({ message: `User freelancer status updated successfully` });
  } catch (error) {
    console.error('Error updating freelancer status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;
    
    // Extract fields from profileData
    const { full_name, bio } = profileData;
    
    await pool.query(
      'UPDATE sign_up SET name = ?, bio = ? WHERE id = ?',
      [full_name, bio, userId]
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM sign_up WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
