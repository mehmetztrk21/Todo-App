import express from 'express';
import mssql from 'mssql';
import cors from 'cors';
import {config} from './utils/config.js'
const app = express();
const port = 3001;
import { router as authRouter } from "./routes/auth.js";
import { router as todosRouter } from "./routes/todos.js";

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

// Rotaları tanımla
app.use('/todos', todosRouter);
app.use('/auth', authRouter);

// Bağlantıyı başlat
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Sunucu ${port} portunda çalışıyor.`);
    });
});
