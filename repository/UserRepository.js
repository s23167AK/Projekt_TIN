const User = require('../model/User');

exports.createUser = async (userData) => {
    try {
        return await User.create(userData);
    } catch (error) {
        throw new Error('Błąd podczas tworzenia użytkownika: ' + error.message);
    }
};

exports.findUserByEmail = async (email) => {
    try {
        return await User.findOne({ where: { email } });
    } catch (error) {
        throw new Error('Błąd podczas wyszukiwania użytkownika: ' + error.message);
    }
};

exports.findUserByUsername = async (username) => {
    try {
        return await User.findOne({ where: { username } });
    } catch (error) {
        throw new Error('Błąd podczas wyszukiwania użytkownika: ' + error.message);
    }
};
