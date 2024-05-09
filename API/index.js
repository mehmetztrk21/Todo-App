const express = require('express');
const mssql = require('mssql');
const md5 = require('md5');
const cors = require('cors');
const app = express();
const port = 3001;

// MSSQL bağlantı ayarları
const config = {
    user: '',
    password: '',
    server: '',
    database: 'TODO',
    options: {
        enableArithAbort: true,
        encrypt: false
    }
};

// MSSQL bağlantısını oluştur
async function connectDB() {
    try {
        await mssql.connect(config);
        console.log('MSSQL veritabanına bağlandı.');
    } catch (error) {
        console.error('MSSQL bağlantı hatası:', error);
    }
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Kullanıcı kaydı oluşturma
app.post('/register', async (req, res) => {
    let { username, password } = req.body;
    try {
        const pool = await mssql.connect(config);
        password = md5(password);
        const isUserExist = await pool
            .request()
            .input('username', mssql.NVarChar, username)
            .query('SELECT * FROM Users WHERE Username = @username');
        if (isUserExist.recordset.length > 0) {
            return res.status(400).send('Kullanıcı adı zaten kullanılıyor.');
        }
        var result = await pool
            .request()
            .input('username', mssql.NVarChar, username)
            .input('password', mssql.NVarChar, password)
            .query('INSERT INTO Users (Username, Password) VALUES (@username, @password)');
        result = await pool
            .request()
            .input('username', mssql.NVarChar, username)
            .input('password', mssql.NVarChar, password)
            .query('SELECT * FROM Users WHERE Username = @username AND Password = @password');
        res.status(201).send({ message: 'Kullanıcı kaydı oluşturuldu.', user: result.recordset[0] });
    } catch (error) {
        console.error('Kullanıcı kaydı hatası:', error);
        res.status(500).send('Kullanıcı kaydı oluşturulamadı.');
    }
});

// Kullanıcı girişi
app.post('/login', async (req, res) => {
    let { username, password } = req.body;
    try {
        password = md5(password);
        const pool = await mssql.connect(config);
        const result = await pool
            .request()
            .input('username', mssql.NVarChar, username)
            .input('password', mssql.NVarChar, password)
            .query('SELECT * FROM Users WHERE Username = @username AND Password = @password');
        if (result.recordset.length > 0) {
            res.status(200).send(result.recordset[0]);
        } else {
            res.status(401).send('Kullanıcı adı veya şifre yanlış.');
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).send('Giriş yapılamadı.');
    }
});

// Todo listesi
app.get('/todos', async (req, res) => {
    try {
        const pool = await mssql.connect(config);
        var { userId } = req.query;
        if (userId == null)
            return res.status(400).send('Kullanıcı bilgisi eksik');
        const result = await pool.request().query('SELECT * FROM Todos WHERE UserId = ' + userId + ' and IsDeleted=0 ORDER BY Id DESC');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Todo listesi hatası:', error);
        res.status(500).send('Todo listesi alınamadı.');
    }
});

// Todo oluşturma
app.post('/todos', async (req, res) => {
    const { userId, todo } = req.body;
    try {
        const pool = await mssql.connect(config);
        const result = await pool
            .request()
            .input('userId', mssql.Int, userId)
            .input('todo', mssql.NVarChar, todo)
            .query('INSERT INTO Todos (UserId, Todo, IsCompleted) VALUES (@userId, @todo,0)');
        res.status(201).send('Todo oluşturuldu.');
    } catch (error) {
        console.error('Todo oluşturma hatası:', error);
        res.status(500).send('Todo oluşturulamadı.');
    }
});
// Todo silme
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await mssql.connect(config);
        const result = await pool
            .request()
            .input('id', mssql.Int, id)
            .query('UPDATE Todos SET IsDeleted=1 WHERE Id = @id');
        res.status(200).send('Todo silindi.');
    } catch (error) {
        console.error('Todo silme hatası:', error);
        res.status(500).send('Todo silinemedi.');
    }
});
// Todo güncelleme
app.put('/todos', async (req, res) => {
    const { todo, id, isCompleted } = req.body;
    try {
        const pool = await mssql.connect(config);
        const result = await pool
            .request()
            .input('id', mssql.Int, id)
            .input('todo', mssql.NVarChar, todo)
            .input('isCompleted', mssql.Bit, isCompleted)
            .query('UPDATE Todos SET Todo = @todo, IsCompleted=@isCompleted WHERE Id = @id');
        res.status(200).send('Todo güncellendi.');
    } catch (error) {
        console.error('Todo güncelleme hatası:', error);
        res.status(500).send('Todo güncellenemedi.');
    }
});

// Bağlantıyı başlat
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Sunucu ${port} portunda çalışıyor.`);
    });
});
