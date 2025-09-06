const { verify } = require('../utils/jwt');


module.exports = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    try {
        const payload = await verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};