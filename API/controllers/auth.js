import mssql from 'mssql';
import md5 from 'md5';
import { config } from '../utils/config.js';
export const register = async (req, res) => {
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
}

export const login = async (req, res) => {
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
            return res.status(200).send(result.recordset[0]);
        } else {
            return res.status(401).send('Kullanıcı adı veya şifre yanlış.');
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        return res.status(500).send('Giriş yapılamadı.');
    }
}