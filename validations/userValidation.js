const { body } = require('express-validator');

exports.createUserValidation = [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character'),
    body('phone_number').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('address').optional().isString().trim(),

];

exports.updateUserValidation = [
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('password')
        .optional()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character'),
];
