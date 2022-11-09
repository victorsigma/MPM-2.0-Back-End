import sql from 'mssql';

const dbSettings = {
    user: 'Sigma',
    password: 'montesgaray',
    server: 'localhost',
    database: 'MPM2',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

export async function getConnection() {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.error(error);
    }
}

export { sql };