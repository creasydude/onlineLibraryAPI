const refreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
        secure: process.env.NODE_ENV === 'production'
    });
}

export default refreshTokenCookie;