class UsersDB {
    static async addUser(model, user) {
        try {
            await model.create(user);
        }
        catch (error) {
            throw error;
        }
    }

    static async exists(model, usernameArg) {
        try {
            const exists = (await model.count({
                where: {
                    username: usernameArg
                }
            })) !== 0;

            return exists;
        }
        catch (error) {
            throw error;
        }
    }

    static async passwordCorrect(model, usernameArg, passwordArg) {
        try {
            const exists = await this.exists(model, usernameArg);

            if (exists) {
                const user = await this.getOneUser(model, usernameArg);
                return user.password === passwordArg;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw error;
        }
    }

    static async getOneUser(model, usernameArg) {
        try {
            const exists = await this.exists(model, usernameArg);

            if (exists) {
                const user = (await model.findByPk(usernameArg)).toJSON();
                return user;
            }
            else {
                return null;
            }
        }
        catch (error) {
            throw error;
        }
    }

    static async deleteOneUser(model, usernameArg) {
        try {
            const exists = await this.exists(model, usernameArg);

            if (exists) {
                const destroyedRows = await model.destroy({
                    where: {
                        username: usernameArg
                    }
                });

                return destroyedRows;
            }
            else {
                return 0;
            }
        }
        catch (error) {
            throw error;
        }
    }

    static async setAttribute(model, usernameArg, attributeName, newValue) {
        try {
            const exists = await this.exists(model, usernameArg);

            if (exists) {
                if (attributeName === 'username') {
                    await model.update({ username: newValue }, {
                        where: {
                            username: usernameArg
                        }
                    });
                }
                else if (attributeName === 'email') {
                    await model.update({ email: newValue }, {
                        where: {
                            username: usernameArg
                        }
                    });
                }
                else if (attributeName === 'password') {
                    await model.update({ password: newValue }, {
                        where: {
                            username: usernameArg
                        }
                    });
                }
                else {
                    throw new Error('Unknown attribute');
                }

                return newValue;
            }
            else {
                return null;
            }
        }
        catch (error) {
            throw error;
        }
    }

    static async setUsername(model, usernameArg, newUsername) {
        try {
            const result = await this.setAttribute(model, usernameArg, 'username', newUsername);
            return result;
        }
        catch (error) {
            throw error;
        }
    }

    static async setEmail(model, usernameArg, newEmail) {
        try {
            const result = await this.setAttribute(model, usernameArg, 'email', newEmail);
            return result;
        }
        catch (error) {
            throw error;
        }
    }

    static async setPassword(model, usernameArg, newPassword) {
        try {
            const result = await this.setAttribute(model, usernameArg, 'password', newPassword);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = UsersDB;

// const fs = require('fs');
// const { promisify } = require('util');
// const PATH = './models/users-db.json';

// const writeFileAsync = promisify(fs.writeFile);
// const readFileAsync = promisify(fs.readFile);

// class UsersDB {
//     static async isInitialized() {
//         try {
//             const data = await readFileAsync(PATH, 'utf-8');

//             if (data !== '') {
//                 return true;
//             }
//             else {
//                 return false;
//             }
//         }
//         catch (error) {
//             throw error;
//         }
//     }
    
//     static async initialize() {
//         const users = [];
    
//         try {
//             await writeFileAsync(PATH, JSON.stringify(users, null, 4));
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async getUsers() {
//         try {
//             const data = await readFileAsync(PATH, 'utf-8');
//             const users = JSON.parse(data);
//             return users;
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async setUsers(users) {
//         try {
//             await writeFileAsync(PATH, JSON.stringify(users, null, 4));
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async addUser(user) {
//         try {
//             const users = await this.getUsers();
//             users.push(user);
//             await writeFileAsync(PATH, JSON.stringify(users, null, 4));
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async findIndex(username) {
//         try {
//             const users = await this.getUsers();
//             const index = users.findIndex(user => user.username === username);
//             return index;
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async exists(username) {
//         try {
//             const index = await this.findIndex(username);
//             return index !== -1;
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async passwordCorrect(username, password) {
//         try {
//             const index = await this.findIndex(username);

//             if (index !== -1) {
//                 const users = await this.getUsers();
//                 const isPasswordCorrect = users[index].password === password;
//                 return isPasswordCorrect;
//             }
//             else {
//                 return false;
//             }
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async getOneUser(username) {
//         try {
//             const index = await this.findIndex(username);

//             if (index !== -1) {
//                 const users = await this.getUsers();
//                 return users[index];
//             }
//             else {
//                 return null;
//             }
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async setAttribute(username, attributeName, newValue) {
//         try {
//             const exists = await this.exists(username);

//             if (exists) {
//                 const users = await this.getUsers();
//                 const index = await this.findIndex(username);

//                 if (attributeName === 'username') {
//                     users[index].username = newValue;
//                     await this.setUsers(users);
//                 }
//                 else if (attributeName === 'email') {
//                     users[index].email = newValue;
//                     await this.setUsers(users);
//                 }
//                 else if (attributeName === 'password') {
//                     users[index].password = newValue;
//                     await this.setUsers(users);
//                 }
//                 else {
//                     throw new Error('Unknown active user set attribute');
//                 }

//                 return newValue;
//             }
//             else {
//                 return null;
//             }
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async setUsername(username, newUsername) {
//         try {
//             const result = await this.setAttribute(username, 'username', newUsername);
//             return result;
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async setEmail(username, newEmail) {
//         try {
//             const result = await this.setAttribute(username, 'email', newEmail);
//             return result;
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async setPassword(username, newPassword) {
//         try {
//             const result = await this.setAttribute(username, 'password', newPassword);
//             return result;
//         }
//         catch (error) {
//             throw error;
//         }
//     }
// }

// module.exports = UsersDB;
