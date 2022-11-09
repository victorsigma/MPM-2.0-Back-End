import { getConnection, sql, querys } from "../database";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(querys.getUsers);
        res.json(result.recordset);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const addUser = async (req, res) => {
    const { UserName, Email, UserPass } = req.body

    const data = req.body;

    const hashedPassword = await bcrypt.hash(UserPass, 10);

    //Validar datos no nulos
    if (
        UserName == null ||
        Email == null ||
        UserPass == null
    ) {
        return res.status(400).json({msg: 'Bad Request'});
    }

    //Atrapador de errores
    try {
        const pool = await getConnection();
        //Optener datos de usuario para validad datos duplicados
        const checkName = await pool.request().input('userName', sql.VarChar, UserName).query(querys.checkName);

        const checkNameDatos = checkName.recordset;

        //Validar usuarios duplicados
        if(checkNameDatos.length == 0) {
            //Optener datos de correo para validad datos duplicados
            const checkEmail = await pool.request().input('userMail', sql.VarChar, Email).query(querys.checkEmail);

            const checkEmailDatos = checkEmail.recordset;

            //Validar correos duplicados
            if(checkEmailDatos.length == 0) {
                //Registro de usuarios
                await pool.request()
                .input('userName', sql.VarChar, UserName)
                .input('password', sql.VarChar, hashedPassword)
                .input('userMail', sql.VarChar, Email)
                .query(querys.setUser);
                res.json(data);
            } else {
                //Salida para correos duplicados
                return res.status(208).json({msg: 'Registered Email'});
            }
        } else {
            //Salida para usuario duplicado
            return res.status(208).json({msg: 'Registered User'});
        }
    } catch (error) {
        //Salida para datos erroneos
        res.status(500);
        res.send(error.message)
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();

        const result = await pool.request()
        .input('id', id)
        .query(querys.getUserById);

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const deleteUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        await pool.request()
        .input('id', id)
        .query(querys.deleteUser);

        res.sendStatus(204)
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}


export const updateUserById = async (req, res) => {
    const { id } = req.params
    const { UserName, Email, UserPass } = req.body

    const hashedPassword = await bcrypt.hash(UserPass, 10);

    if (
        UserName == null ||
        Email == null ||
        UserPass == null
    ) {
        return res.status(400).json({msg: 'Bad Request'});
    }

    try {
        const pool = await getConnection();

        await pool.request()
        .input('id', id)
        .input('userName', sql.VarChar, UserName)
        .input('password', sql.VarChar, hashedPassword)
        .input('userMail', sql.VarChar, Email)
        .query(querys.updateUser);

        const result = await pool.request()
        .input('id', id)
        .query(querys.getUserById);

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const loginUserByEmail = async (req, res) => {
    const {Email, UserPass} = req.body;
    

    try {
        const pool = await getConnection();
        const result = await pool.request().input('userMail', sql.VarChar, Email).query(querys.loginEmail);

        const data = result.recordset
        
        if(data.length == 0) {
            res.json({ msg: 'The user does not exist'})
        } else {
            const userPassword = data[0].UserPass;
            bcrypt.compare(UserPass, userPassword).then((result) => {
                if(result) {
                    const token = jwt.sign({
                        UserName: data[0].UserName,
                        Email: Email,
                        UserIcon: data[0].UserIcon
                    }, '77767b40-fedc-11ec-b939-0242ac120002')
                    res.json({ token })
                } else {
                    res.json({ msg: 'Incorrect password' })
                }
            })
        }
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}


export const loginUserByName = async (req, res) => {
    const {UserName, UserPass} = req.body;
    

    try {
        const pool = await getConnection();
        const result = await pool.request().input('userName', sql.VarChar, UserName).query(querys.loginName);

        const data = result.recordset
        
        if(data.length == 0) {
            res.json({ msg: 'The user does not exist'})
        } else {
            const userPassword = data[0].UserPass;
            bcrypt.compare(UserPass, userPassword).then((result) => {
                if(result) {
                    const token = jwt.sign({
                        UserName: UserName,
                        Email: data[0].Email,
                        UserIcon: data[0].UserIcon
                    }, '77767b40-fedc-11ec-b939-0242ac120002')
                    res.json({ token })
                } else {
                    res.json({ msg: 'Incorrect password' })
                }
            })
        }
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}

export const updateIcon = async (req, res) => {
    const { user } = req.params
    const { UserIcon } = req.body

    if (
        UserIcon == null
    ) {
        return res.status(400).json({msg: 'Bad Request'});
    }

    try {
        const pool = await getConnection();

        await pool.request()
        .input('userName', user)
        .input('userIcon', sql.VarChar, UserIcon)
        .query(querys.updateIcon);

        const checkName = await pool.request().input('userName', sql.VarChar, user).query(querys.checkName);

        const data = checkName.recordset;

        const token = jwt.sign({
            UserName: data[0].UserName,
            Email: data[0].Email,
            UserIcon: data[0].UserIcon
        }, '77767b40-fedc-11ec-b939-0242ac120002')
        res.json({ token })
    } catch (error) {
        res.status(500);
        res.send(error.message)
    }
}