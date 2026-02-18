const User = require('../Models/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });
    jwt.verify(token, 'YOUR_SECRET_KEY', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.userId = decoded.id;
        next();
    });
};

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        // Save to DB
        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email: username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check role
        if (role && user.role !== role) {
            return res.status(403).json({ success: false, message: 'Role mismatch' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            'YOUR_SECRET_KEY',
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout = (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
    verifyToken,
    register,
    login,
    getCurrentUser,
    logout
};