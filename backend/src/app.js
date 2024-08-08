const express = require("express");
const bodyParser = require("body-parser");
const Database = require("better-sqlite3");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const port = 5000;

// Configuración de JWT
const JWT_SECRET = "your_jwt_secret_key"; 

// Configurar el middleware
app.use(
  cors({
    origin: "*", 
    methods: ["*"],
    allowedHeaders: ["Content-Type, authorization"],
  })
);
app.use(bodyParser.json());


const dbPath = path.join(__dirname, "database", "database.db");
const db = new Database(dbPath, { verbose: console.log });


app.get('/api/has-marked-today/:username', (req, res) => {
  const { username } = req.params;
  const today = new Date().toISOString().split('T')[0]; // Obtener la fecha en formato YYYY-MM-DD

  try {
    const rows = db.prepare('SELECT COUNT(*) AS count FROM llegada WHERE nombre = ? AND DATE(fecha) = ?').all(username, today);

    if (rows.length > 0) {
      res.json({ hasMarked: rows[0].count > 0 });
    } else {
      res.json({ hasMarked: false });
    }
  } catch (error) {
    console.error('Error al consultar la llegada:', error);
    res.status(500).json({ error: 'Error al consultar la llegada' });
  }
});







app.post('/api/llegada', (req, res) => {
  const { username, hora_entrada } = req.body;
  try {
    db.prepare('INSERT INTO llegada (nombre, hora_entrada) VALUES (?, ?)')
      .run(username, hora_entrada); // `hora_entrada` debe estar en formato 'HH:MM:SS'
    res.status(201).json({ message: 'Llegada registrada exitosamente' });
  } catch (error) {
    console.error('Error al registrar la llegada:', error);
    res.status(500).json({ error: 'No se pudo registrar la llegada' });
  }
});



app.get('/api/users', (req, res) => {
  try {
      const users = db.prepare('SELECT * FROM users').all();
      res.json(users);
  } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/dinamic', async (req, res) => {
  try {
   
    const userDataQuery = 'SELECT * FROM user_data';
    const rows = db.prepare(userDataQuery).all();

    if (rows.length === 0) {
        return res.json({ columns: [], rows: [] });
    }

    // Obtener las columnas dinámicas
    const columns = Object.keys(rows[0]); // Extrae las columnas a partir de la primera fila de resultados

    res.json({ columns, rows });
} catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
}
});

app.post('/api/user-data/add', (req, res) => {
  const { user_id, nombre, fecha, ...otherFields } = req.body;

  if (!user_id || !nombre || !fecha) {
      return res.status(400).json({ error: 'User ID, nombre, and fecha are required' });
  }

  try {
      const columns = ['user_id', 'nombre', 'fecha', ...Object.keys(otherFields)];
      const placeholders = columns.map(() => '?').join(', ');

      const query = `INSERT INTO user_data (${columns.join(', ')}) VALUES (${placeholders})`;
      const params = [user_id, nombre, fecha, ...Object.values(otherFields)];
      const result = db.prepare(query).run(...params);

      const newRow = { id: result.lastInsertRowid, user_id, nombre, fecha, ...otherFields };
      res.status(201).json(newRow);
  } catch (error) {
      console.error('Error adding user data:', error);
      res.status(500).json({ error: 'Failed to add user data' });
  }
});






app.get('/api/user-data', (req, res) => {
  const { username } = req.query;

  if (!username) {
      return res.status(400).json({ error: 'Username is required' });
  }

  try {
      // Obtén los datos del usuario
      const stmt = db.prepare('SELECT * FROM user_data WHERE nombre = ?');
      const userData = stmt.all(username);

      if (userData.length > 0) {
          // Obtén la estructura de la tabla
          const columns = Object.keys(userData[0]);

          res.status(200).json({ columns, data: userData });
      } else {
          res.status(404).json({ error: 'User not found' });
      }
  } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
  }
});


app.post('/api/user_data', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM user_data WHERE username = ?');
    const userData = stmt.get(username);

    if (userData) {
      res.status(200).json(userData);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});
app.post('/api/user_data', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM user_data WHERE username = ?');
    const userData = stmt.get(username);

    if (userData) {
      res.status(200).json(userData);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});



app.post('/api/inventory', (req, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || quantity == null) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const result = db.prepare('INSERT INTO inventario  (product_id, quantity) VALUES (?, ?)').run(product_id, quantity);
    const newItem = {
      id: result.lastInsertRowid,
      product_id,
      quantity,
    };
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT id, name, price FROM products').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
// Obtener inventario
app.get('/api/inventory', (req, res) => {
  const inventory = db.prepare('SELECT * FROM inventario').all();
  res.json(inventory);
});

// Añadir producto al inventario
app.post('/api/user_data', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM user_data WHERE username = ?');
    const userData = stmt.get(username);

    if (userData) {
      res.status(200).json(userData);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});


// Editar producto en inventario
app.put('/api/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined) {
      return res.status(400).json({ error: 'Quantity is required' });
  }

  try {
      db.prepare('UPDATE inventario SET quantity = ? WHERE id = ?').run(quantity, id);
      res.status(200).json({ message: 'Product quantity updated' });
  } catch (error) {
      console.error('Error updating product quantity:', error);
      res.status(500).json({ error: 'Failed to update product quantity' });
  }
});

// Eliminar producto del inventario
app.delete('/api/inventory/:id', (req, res) => {
  const { id } = req.params;

  try {
      db.prepare('DELETE FROM inventario WHERE id = ?').run(id);
      res.status(200).json({ message: 'Product removed from inventory' });
  } catch (error) {
      console.error('Error removing product from inventory:', error);
      res.status(500).json({ error: 'Failed to remove product from inventory' });
  }
});




app.post('/api/delete-column', (req, res) => {
  const { columnName } = req.body;

  if (!columnName) {
    return res.status(400).json({ error: 'Column name is required' });
  }

  try {
    // Verificar si la columna existe
    const checkColumnQuery = `PRAGMA table_info(user_data);`;
    const columns = db.prepare(checkColumnQuery).all();
    const columnExists = columns.some(col => col.name === columnName);

    if (!columnExists) {
      return res.status(400).json({ error: 'Column does not exist' });
    }

    // Crear una tabla temporal sin la columna a eliminar
    const tempTableName = 'user_data_temp';
    const columnsToKeep = columns.filter(col => col.name !== columnName).map(col => `${col.name} ${col.type}`);
    const createTempTableQuery = `
      CREATE TABLE ${tempTableName} (${columnsToKeep.join(', ')});
    `;
    db.prepare(createTempTableQuery).run();

    // Copiar los datos a la tabla temporal
    const copyDataQuery = `
      INSERT INTO ${tempTableName} (${columnsToKeep.map(col => col.split(' ')[0]).join(', ')})
      SELECT ${columnsToKeep.map(col => col.split(' ')[0]).join(', ')}
      FROM user_data;
    `;
    db.prepare(copyDataQuery).run();

    // Eliminar la tabla original y renombrar la tabla temporal
    db.prepare('DROP TABLE user_data').run();
    db.prepare(`ALTER TABLE ${tempTableName} RENAME TO user_data`).run();

    res.status(200).json({ message: 'Column deleted successfully' });
  } catch (error) {
    console.error('Error deleting column:', error);
    res.status(500).json({ error: 'Failed to delete column' });
  }
});

app.get('/api/columns', (req, res) => {
  try {
    const query = 'PRAGMA table_info(user_data);';
    const columns = db.prepare(query).all();
    const columnNames = columns.map(col => col.name);
    res.status(200).json(columnNames);
  } catch (error) {
    console.error('Error fetching columns:', error);
    res.status(500).json({ error: 'Failed to fetch columns' });
  }
});




app.post('/api/add-job-type', (req, res) => {
  const { jobType } = req.body;

  if (!jobType) {
    return res.status(400).json({ error: 'Job type is required' });
  }

  try {
    
    const checkColumnQuery = `PRAGMA table_info(user_data);`;
    const columns = db.prepare(checkColumnQuery).all();
    const columnExists = columns.some(col => col.name === jobType);

    if (columnExists) {
      return res.status(400).json({ error: 'Column already exists' });
    }

    const addColumnQuery = `ALTER TABLE user_data ADD COLUMN ${jobType} INTEGER`;
    db.prepare(addColumnQuery).run();
    res.status(200).json({ message: 'Column added successfully' });
  } catch (error) {
    console.error('Error adding column:', error);
    res.status(500).json({ error: 'Failed to add column' });
  }
});


// Endpoint para crear un nuevo producto
app.post('/api/products', async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
  }

  try {
      const result = await db.prepare("INSERT INTO products (name, price) VALUES (?, ?)").run(name, price);
      const productId = result.lastInsertRowid;
      res.status(201).json({ id: productId, name, price });
  } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Failed to add product' });
  }
});

// Endpoint para obtener todos los productos
app.get('/api/products', async (req, res) => {
  try {
      const products = await db.prepare("SELECT * FROM products").all();
      res.status(200).json(products);
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Endpoint para obtener un producto por ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const product = await db.prepare("SELECT * FROM products WHERE id = ?").get(id);
      if (product) {
          res.status(200).json(product);
      } else {
          res.status(404).json({ error: 'Product not found' });
      }
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Endpoint para actualizar un producto
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
  }

  try {
      await db.prepare("UPDATE products SET name = ?, price = ? WHERE id = ?").run(name, price, id);
      res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
  }
});

// Endpoint para eliminar un producto
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
      await db.prepare("DELETE FROM products WHERE id = ?").run(id);
      res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
  }
});







// Ruta para agregar materia prima
app.post("/api/materia-prima", (req, res) => {
  const { nombre, cantidad, precio } = req.body;
  const fechaIngreso = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });

  if (!nombre || !cantidad || !precio) {
    return res.status(400).json({ error: "Nombre, cantidad y precio son requeridos" });
  }

  try {
    db.prepare(
      "INSERT INTO materia_prima (nombre, cantidad, precio, fecha_ingreso) VALUES (?, ?, ?, ?)"
    ).run(nombre, cantidad, precio, fechaIngreso);
    res.status(201).json({ message: "Materia prima agregada exitosamente" });
  } catch (error) {
    console.error("Error agregando materia prima:", error);
    res.status(500).json({ error: "No se pudo agregar la materia prima" });
  }
});

// Ruta para obtener todas las materias primas
app.get("/api/materia-prima", (req, res) => {
  try {
    const materiasPrimas = db.prepare("SELECT * FROM materia_prima").all();
    res.status(200).json(materiasPrimas);
  } catch (error) {
    console.error("Error obteniendo materia prima:", error);
    res.status(500).json({ error: "No se pudo obtener la materia prima" });
  }
});

// Ruta para obtener una materia prima específica
app.get("/api/materia-prima/:id", (req, res) => {
  const { id } = req.params;

  try {
    const materiaPrima = db.prepare("SELECT * FROM materia_prima WHERE id = ?").get(id);
    if (materiaPrima) {
      res.status(200).json(materiaPrima);
    } else {
      res.status(404).json({ error: "Materia prima no encontrada" });
    }
  } catch (error) {
    console.error("Error obteniendo materia prima:", error);
    res.status(500).json({ error: "No se pudo obtener la materia prima" });
  }
});

// Ruta para actualizar una materia prima
app.put("/api/materia-prima/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, cantidad, precio } = req.body;

  try {
    db.prepare(
      "UPDATE materia_prima SET nombre = ?, cantidad = ?, precio = ? WHERE id = ?"
    ).run(nombre, cantidad, precio, id);
    res.status(200).json({ message: "Materia prima actualizada exitosamente" });
  } catch (error) {
    console.error("Error actualizando materia prima:", error);
    res.status(500).json({ error: "No se pudo actualizar la materia prima" });
  }
});

// Ruta para borrar una materia prima
app.delete("/api/materia-prima/:id", (req, res) => {
  const { id } = req.params;

  try {
    db.prepare("DELETE FROM materia_prima WHERE id = ?").run(id);
    res.status(200).json({ message: "Materia prima borrada exitosamente" });
  } catch (error) {
    console.error("Error borrando materia prima:", error);
    res.status(500).json({ error: "No se pudo borrar la materia prima" });
  }
});









app.get("/api/verify-role", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Obtener token del header
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  jwt.verify(token, "your_jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.status(200).json({ role: decoded.role }); // Enviar el rol del usuario
  });
});

app.get("/api/user-data/:username", (req, res) => {
  const { username } = req.params; // Obtén el username del parámetro de la solicitud

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const userData = db
      .prepare("SELECT * FROM user_data WHERE nombre = ?")
      .get(username);
    if (userData) {
      res.status(200).json(userData);
    } else {
      res.status(404).json({ error: "User data not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.get("/api/user-data/:id", (req, res) => {
  const { id } = req.params; // Obtén el ID del parámetro de la solicitud

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const userData = db
      .prepare("SELECT * FROM user_data WHERE user_id = ?")
      .get(id);
    if (userData) {
      res.status(200).json(userData);
    } else {
      res.status(404).json({ error: "User data not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.get("/api/users", (req, res) => {
  try {
    const users = db.prepare("SELECT username FROM users").all();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/user-id/:username", (req, res) => {
  const { username } = req.params;

  try {
    const user = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(username);
    if (user) {
      res.json({ id: user.id });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user ID" });
  }
});

// Ruta para guardar los datos del usuario
app.post("/api/user-data", (req, res) => {
  const { userId, nombre, velas, papel, fecha } = req.body;

  if (!userId || !nombre || !velas || !papel || !fecha) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    db.prepare(
      "INSERT INTO user_data (user_id, nombre, velas, papel, fecha) VALUES (?, ?, ?, ?, ?)"
    ).run(userId, nombre, velas, papel, fecha);
    res.status(201).json({ message: "User data saved successfully" });
  } catch (error) {
    console.error("Error saving user data:", error); // Log the error
    res.status(500).json({ error: "Failed to save user data" });
  }
});
//eliminar
app.delete("/api/users/:username", (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    // Primero eliminar todos los registros asociados al usuario
    db.prepare(
      "DELETE FROM user_data WHERE user_id = (SELECT id FROM users WHERE username = ?)"
    ).run(username);

    // Luego eliminar el usuario de la tabla `users`
    db.prepare("DELETE FROM users WHERE username = ?").run(username);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error); // Log del error
    res.status(500).json({ error: "Failed to delete user" });
  }
});

//crear usuario
app.post("/api/users", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ error: "Username, password, and role are required" });
  }

  // Verificar si el usuario ya existe
  const existingUser = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Encriptar la contraseña
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  try {
    // Insertar el nuevo usuario en la base de datos
    const result = db
      .prepare("INSERT INTO users (username, password, rol) VALUES (?, ?, ?)")
      .run(username, hashedPassword, role);

    // Obtener el ID del usuario recién creado
    const userId = result.lastInsertRowid;

    // Insertar datos iniciales en user_data
    if (role == "employee") {
      db.prepare(
        "INSERT INTO user_data (user_id, nombre, velas, papel, fecha) VALUES (?, ?, ?, ?, ?)"
      ).run(userId, username, 0, 0, new Date().toISOString());
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error); // Log del error
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Ruta de login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Buscar el usuario en la base de datos
  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);

  if (user && bcrypt.compareSync(password, user.password)) {
    // Generar el token JWT
    const token = jwt.sign(
      { username: user.username, role: user.rol },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      userId: user.id, // Incluye el userId en la respuesta
      role: user.rol,
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Middleware para verificar el token y el rol
const authorize = (roles) => (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Ruta protegida para administradores
app.get("/api/admin", authorize(["admin"]), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// Ruta protegida para empleados
app.get("/api/employee", authorize(["employee", "admin"]), (req, res) => {
  res.json({ message: "Welcome, Employee!" });
});

// Iniciar el servidor
app.listen(port, "192.168.0.16", () => {
  console.log(`Server running at http://192.168.0.16:${port}`);
});
