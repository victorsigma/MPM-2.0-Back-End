export const querys = {
    getUsers: 'SELECT * FROM Users',

    getUserId: "SELECT UserId FROM Users WHERE UserName = @userName",

    setUser: 'INSERT INTO Users (UserName, Email, UserPass, UserIcon) VALUES (@userName, @userMail, @password, \'user_icon_1\')',

    getUserById: 'SELECT * FROM Users WHERE UserID = @id',

    deleteUser: 'DELETE FROM Users WHERE UserID = @id',

    updateUser: 
    `UPDATE Users
        Set UserName = @userName, 
        UserPass = @password,
        Email = @userMail
    WHERE UserID = @id`,

    loginEmail: 'SELECT * FROM Users WHERE Email = @userMail',
    loginName: 'SELECT * FROM Users WHERE UserName = @userName',

    checkName: 'SELECT * FROM Users WHERE UserName = @userName',
    checkEmail: 'SELECT * FROM Users WHERE Email = @userMail',

    updateIcon: 
    `UPDATE Users
        Set UserIcon = @userIcon
    WHERE UserName = @userName`,

    getStructures: 'SELECT * FROM Structures',

    getStructure: 'SELECT * FROM Structures WHERE StructureId = @structureId',

    getCart: 'SELECT * FROM Cart',
    
    getCartById: 'SELECT CartId, StructureId, CountProduct FROM Cart WHERE CartId = @id',

    getCartTotalByUser: 
    `SELECT FORMAT(SUM(C.CountProduct * S.StructurePrice), 'N2') AS 'Total'
    FROM Cart AS C INNER JOIN Structures AS S
    On C.StructureId = S.StructureId
    WHERE C.UserId = @user`,

    updateCart: 
    `UPDATE Cart
        Set CountProduct = @countProduct
    WHERE CartId = @id`,

    cartLenght:
    `SELECT COUNT(CartId) AS 'Lenght'
    FROM Cart
    WHERE UserId = @user`,

    checkCart: 'SELECT * FROM Cart WHERE StructureId = @structureId AND UserID = @userId',

    setCart: 'INSERT INTO Cart (UserId, StructureId, CountProduct) VALUES (@userId, @structureId, @countProduct)',

    getCartByUser: 'SELECT CartId, StructureId, CountProduct FROM Cart WHERE UserID = @user',

    deleteCart: 'DELETE FROM Cart WHERE CartId = @id',
}