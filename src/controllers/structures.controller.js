import { getConnection, sql, querys } from "../database";


export const getStructures = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(querys.getStructures);
        res.json(result.recordset);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const getStructuresById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();

        const result = await pool.request()
        .input('structureId', id)
        .query(querys.getStructure);

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}