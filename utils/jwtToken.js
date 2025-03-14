export const generateToken = (user, message, statusCode, res)=>{
    const token = user.generateJsonWebToken();
    const cookieName = user.role === 'admin' ? 'adminToken' : 'userToken';
    res.ststus(statusCode).cookie(cookieName, token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    }).json({
        success: true,
        message,
        user,
        token,
    });
};