const bcrypt = require('bcrypt');
const UserRepository = require('../repository/UserRepository');

// Renderowanie formularza rejestracji
exports.showRegistrationForm = (req, res) => {
    res.render('pages/auth/register', {
        navLocation: 'register'
    });
};

// Obsługa rejestracji
exports.registerUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('pages/auth/register', {
            navLocation: 'register',
            errorMessage: 'Hasła muszą być identyczne'
        });
    }

    try {
        const existingUserByEmail = await UserRepository.findUserByEmail(email);
        const existingUserByUsername = await UserRepository.findUserByUsername(username);

        if (existingUserByEmail) {
            return res.render('pages/auth/register', {
                navLocation: 'register',
                errorMessage: 'Podany e-mail jest już zajęty'
            });
        }

        if (existingUserByUsername) {
            return res.render('pages/auth/register', {
                navLocation: 'register',
                errorMessage: 'Nazwa użytkownika jest już zajęta'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserRepository.createUser({
            username,
            email,
            password: hashedPassword
        });

        res.redirect('/');
    } catch (error) {
        console.error('Błąd rejestracji:', error);
        res.render('pages/auth/register', {
            navLocation: 'register',
            errorMessage: 'Rejestracja nie powiodła się. Spróbuj ponownie.'
        });
    }
};

