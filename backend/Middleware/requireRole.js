module.exports = (...allowedRoles) => {
    const allowed = new Set(allowedRoles);

    return (req, res, next) => {
        const role = req.userRole;
        if (!role) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!allowed.has(role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        return next();
    };
};
