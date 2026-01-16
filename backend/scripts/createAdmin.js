import mongoose from 'mongoose';
import User from '../src/modules/auth/user.model.js';
import { config, validateEnv } from '../src/config/env.js';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdminUser() {
    try {
        console.log('\n🔧 Admin User Creation Script\n');

        // Validate environment
        validateEnv();

        // Connect to database
        await mongoose.connect(config.mongodb.uri);
        console.log('✅ Connected to MongoDB\n');

        // Get admin details
        const name = await question('Enter admin name: ');
        const email = await question('Enter admin email: ');
        const password = await question('Enter admin password (min 8 chars): ');

        // Validate password length
        if (password.length < 8) {
            console.error('❌ Password must be at least 8 characters');
            process.exit(1);
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('⚠️  User with this email already exists');
            const update = await question('Update this user to admin? (yes/no): ');

            if (update.toLowerCase() === 'yes') {
                existingUser.role = 'admin';
                await existingUser.save();
                console.log('\n✅ User role updated to admin successfully!');
            } else {
                console.log('❌ Operation cancelled');
            }
        } else {
            // Create new admin user
            const admin = await User.create({
                name,
                email,
                password,
                role: 'admin'
            });

            console.log('\n✅ Admin user created successfully!');
            console.log(`
Admin Details:
- Name: ${admin.name}
- Email: ${admin.email}
- Role: ${admin.role}
      `);
        }

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error creating admin user:', error.message);
        process.exit(1);
    }
}

createAdminUser();
