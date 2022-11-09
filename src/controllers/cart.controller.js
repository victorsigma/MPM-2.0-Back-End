import { getConnection, sql, querys } from "../database";

export const getCart = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(querys.getCart);
        res.json(result.recordset);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const addCart = async (req, res) => {
    const { UserName, StructureId, CountProduct } = req.body

    //Validar datos no nulos
    if (
        UserName == null ||
        StructureId == null ||
        CountProduct == null
    ) {
        return res.status(400).json({msg: 'Bad Request'});
    }

    //Atrapador de errores
    try {
        const pool = await getConnection();
        //Optener datos de usuario para validad datos duplicados
        const checkName = await pool.request().input('userName', sql.VarChar, UserName).query(querys.checkName);

        const checkNameDatos = checkName.recordset;

        //Validar usuarios
        if(checkNameDatos.length != 0) {
            //Optener datos de correo para validad datos
            //Registro de usuarios
            const User = await pool.request().input('userName', sql.VarChar, UserName).query(querys.getUserId);
            const UserId = User.recordset[0].UserId;
            const Structure = await pool.request().input('structureId', sql.VarChar, StructureId).query(querys.getStructure);
            const Stock = Structure.recordset[0].Stock;
            if(CountProduct <= Stock) {
                const cart = await pool.request().input('userId', sql.Int, UserId).input('structureId', sql.VarChar, StructureId).query(querys.checkCart);
                const checkCart = cart.recordset;
                if(checkCart.length == 0) {
                    await pool.request()
                    .input('userId', sql.Int, UserId)
                    .input('structureId', sql.VarChar, StructureId)
                    .input('countProduct', sql.Int, CountProduct)
                    .query(querys.setCart);
                    const data = { UserId, StructureId, CountProduct }
    
                    res.json(data);
                } else {
                    const CartId = checkCart[0].CartId;
                    await pool.request()
                    .input('id', sql.Int, CartId)
                    .input('countProduct', sql.Int, CountProduct)
                    .query(querys.updateCart);

                    const data = { UserId, StructureId, CountProduct }
    
                    res.json(data);
                }
            } else {
                res.status(208).json({msg: 'No Stock'});
            }
        } else {
            return res.status(208).json({msg: 'No Valid User'});
        }
    } catch (error) {
        //Salida para datos erroneos
        res.status(500);
        res.send(error.message)
    }
}

export const getCartByUser = async (req, res) => {
    const { user } = req.params;
    try {
        const pool = await getConnection();
        
        const checkName = await pool.request().input('userName', sql.VarChar, user).query(querys.checkName);

        const checkNameDatos = checkName.recordset;
        //Validar usuarios
        if(checkNameDatos.length != 0) {
            //Optener datos de correo para validad datos
            //Registro de usuarios
            const User = await pool.request().input('userName', sql.VarChar, user).query(querys.getUserId);
            const UserId = User.recordset[0].UserId;

            const result = await pool.request()
            .input('user', UserId)
            .query(querys.getCartByUser);

            res.json(result.recordset);
        } else {
            return res.status(208).json({msg: 'No Valid User'});
        }
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}


export const getCartTotalByUser = async (req, res) => {
    const { user } = req.params;
    try {
        const pool = await getConnection();
        
        const checkName = await pool.request().input('userName', sql.VarChar, user).query(querys.checkName);

        const checkNameDatos = checkName.recordset;
        //Validar usuarios
        if(checkNameDatos.length != 0) {
            const UserId = checkNameDatos[0].UserID;

            const result = await pool.request()
            .input('user', UserId)
            .query(querys.getCartTotalByUser);

            res.json(result.recordset[0]);
        } else {
            return res.status(208).json({msg: 'No Valid User'});
        }
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const getCartLenghtByUser = async (req, res) => {
    const { user } = req.params;
    try {
        const pool = await getConnection();
        
        const checkName = await pool.request().input('userName', sql.VarChar, user).query(querys.checkName);

        const checkNameDatos = checkName.recordset;
        //Validar usuarios
        if(checkNameDatos.length != 0) {
            const UserId = checkNameDatos[0].UserID;

            const result = await pool.request()
            .input('user', UserId)
            .query(querys.cartLenght);

            res.json(result.recordset[0]);
        } else {
            return res.status(208).json({msg: 'No Valid User'});
        }
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}


export const deleteCartById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        await pool.request()
        .input('id', id)
        .query(querys.deleteCart);

        res.sendStatus(204)
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const updateCartById = async (req, res) => {
    const { id } = req.params
    const { CountProduct } = req.body

    if (
        CountProduct == null 
    ) {
        return res.status(400).json({msg: 'Bad Request'});
    }

    try {
        const pool = await getConnection();

        const cart = await pool.request()
                .input('id', id)
                .query(querys.getCartById);
        const cartData = cart.recordset[0];
        const Structure = await pool.request().input('structureId', sql.VarChar, cartData.StructureId).query(querys.getStructure);
        const Stock = Structure.recordset[0].Stock;
        if (CountProduct <= Stock) {
            if(CountProduct > 0) {
                await pool.request()
                .input('id', id)
                .input('countProduct', sql.Int, CountProduct)
                .query(querys.updateCart);

            const result = await pool.request()
                .input('id', id)
                .query(querys.getCartById);

            res.json(result.recordset[0]);
            } else {
                res.status(208).json({msg: 'Out of Range'});
            }
        } else {
            res.status(208).json({msg: 'No Stock'});
        }
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}