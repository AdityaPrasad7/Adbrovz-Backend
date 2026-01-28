const mongoose = require('mongoose');
const Admin = require('../../models/Admin.model');
const { ROLES } = require('../../constants/roles');
const { hashPassword } = require('../../utils/password');

const admins = [
    {
        username: 'adbrovz',
        name: 'Super Admin',
        email: 'admin@adbrovz.com',
        phoneNumber: '1234567890',
        password: 'Password@123',
        role: ROLES.SUPER_ADMIN,
    },
    {
        username: 'adbrovz_tech1',
        name: 'Tech Admin 1',
        email: 'tech1@adbrovz.com',
        phoneNumber: '1234567891',
        password: 'Password@123',
        role: ROLES.ADMIN,
    },
    {
        username: 'adbrovz_tech2',
        name: 'Tech Admin 2',
        email: 'tech2@adbrovz.com',
        phoneNumber: '1234567892',
        password: 'Password@123',
        role: ROLES.ADMIN,
    },
    {
        username: 'adbrovz_tech3',
        name: 'Tech Admin 3',
        email: 'tech3@adbrovz.com',
        phoneNumber: '1234567893',
        password: 'Password@123',
        role: ROLES.ADMIN,
    },
];

const seedAdmins = async () => {
    try {
        console.log('Seeding admins...');

        for (const adminData of admins) {
            const existingAdmin = await Admin.findOne({ username: adminData.username });
            if (!existingAdmin) {
                const hashedPassword = await hashPassword(adminData.password);
                await Admin.create({
                    ...adminData,
                    password: hashedPassword,
                });
                console.log(`✅ Created admin: ${adminData.username}`);
            } else {
                console.log(`ℹ️ Admin already exists: ${adminData.username}`);
            }
        }
    } catch (error) {
        console.error('❌ Error seeding admins:', error.message);
        throw error;
    }
};

module.exports = seedAdmins;
