import mssql from 'mssql';
import { config } from '../utils/config.js';
export const getAll = async (req, res) => {
    try {
        const pool = await mssql.connect(config);
        var { userId } = req.query;
        if (userId == null)
            return res.status(400).send('Kullanıcı bilgisi eksik');
        const result = await pool.request().query('SELECT * FROM Todos WHERE UserId = ' + userId + ' and IsDeleted=0 ORDER BY Id DESC');
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Todo listesi hatası:', error);
        return res.status(500).send('Todo listesi alınamadı.');
    }
}

export const create = async (req, res) => {
    const { userId, todo } = req.body;
    try {
        const pool = await mssql.connect(config);
        const result = await pool
            .request()
            .input('userId', mssql.Int, userId)
            .input('todo', mssql.NVarChar, todo)
            .query('INSERT INTO Todos (UserId, Todo, IsCompleted) VALUES (@userId, @todo,0)');
        return res.status(201).send('Todo oluşturuldu.');
    } catch (error) {
        console.error('Todo oluşturma hatası:', error);
        return res.status(500).send('Todo oluşturulamadı.');
    }
}

export const update = async (req, res) => {
    const { todo, id, isCompleted } = req.body;
    try {
        const pool = await mssql.connect(config);
        const result = await pool
            .request()
            .input('id', mssql.Int, id)
            .input('todo', mssql.NVarChar, todo)
            .input('isCompleted', mssql.Bit, isCompleted)
            .query('UPDATE Todos SET Todo = @todo, IsCompleted=@isCompleted WHERE Id = @id');
        return res.status(200).send('Todo güncellendi.');
    } catch (error) {
        console.error('Todo güncelleme hatası:', error);
        return res.status(500).send('Todo güncellenemedi.');
    }
}

export const remove = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await mssql.connect(config);
        const result = await pool
            .request()
            .input('id', mssql.Int, id)
            .query('UPDATE Todos SET IsDeleted=1 WHERE Id = @id');
        return res.status(200).send('Todo silindi.');
    } catch (error) {
        console.error('Todo silme hatası:', error);
        return res.status(500).send('Todo silinemedi.');
    }
}