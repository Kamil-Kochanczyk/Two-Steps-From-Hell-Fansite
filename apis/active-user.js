class ActiveUser {
    static async isEmpty(model) {
        try {
            const isEmpty = (await model.count()) === 0;
            return isEmpty;
        }
        catch (error) {
            throw error;
        }
    }

    static async get(model) {
        try {
            const isEmpty = await this.isEmpty(model);

            if (!isEmpty) {
                const activeUser = (await model.findAll())[0].toJSON();
                return activeUser;
            }
            else {
                return null;
            }
        }
        catch (error) {
            throw error;
        }
    }
    
    static async set(model, user) {
        try {
            await this.clear(model);
            await model.create(user);
        }
        catch (error) {
            throw error;
        }
    }

    static async clear(model) {
        try {
            await model.destroy({
                truncate: true
            });
        }
        catch (error) {
            throw error;
        }
    }

    static async getAttribute(model, attributeName) {
        try {
            const isEmpty = await this.isEmpty(model);

            if (!isEmpty) {
                const activeUser = await this.get(model);

                if (attributeName === 'username') {
                    return activeUser.username;
                }
                else if (attributeName === 'email') {
                    return activeUser.email;
                }
                else if (attributeName === 'password') {
                    return activeUser.password;
                }
                else {
                    throw new Error('Unknown attribute');
                }
            }
            else {
                return null;
            }
        }
        catch (error) {
            throw error;
        }
    }

    static async getUsername(model) {
        try {
            const username = await this.getAttribute(model, 'username');
            return username;
        }
        catch (error) {
            throw error;
        }
    }

    static async getEmail(model) {
        try {
            const email = await this.getAttribute(model, 'email');
            return email;
        }
        catch (error) {
            throw error;
        }
    }

    static async getPassword(model) {
        try {
            const password = await this.getAttribute(model, 'password');
            return password;
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = ActiveUser;

// const fs = require('fs');
// const { promisify } = require('util');
// const PATH = './models/active-user.json';

// const writeFileAsync = promisify(fs.writeFile);
// const readFileAsync = promisify(fs.readFile);

// class ActiveUser {
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
//         const activeUser = {};

//         try {
//             await writeFileAsync(PATH, JSON.stringify(activeUser, null, 4));
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async isEmpty() {
//         return JSON.stringify(await this.get()) === JSON.stringify({});
//     }
    
//     static async get() {
//         try {
//             const data = await readFileAsync(PATH, 'utf-8');
//             const activeUser = JSON.parse(data);
//             return activeUser;
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async set(user) {
//         try {
//             await writeFileAsync(PATH, JSON.stringify(user, null, 4));
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async getAttribute(attributeName) {
//         try {
//             const activeUser = await this.get();

//             if (attributeName === 'username') {
//                 return activeUser.username;
//             }
//             else if (attributeName === 'email') {
//                 return activeUser.email;
//             }
//             else if (attributeName === 'password') {
//                 return activeUser.password;
//             }
//             else {
//                 throw new Error('Unknown active user get attribute');
//             }
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async getUsername() {
//         try {
//             const username = await this.getAttribute('username');
//             return username;
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async getEmail() {
//         try {
//             const email = await this.getAttribute('email');
//             return email;
//         }
//         catch (error) {
//             throw error;
//         }
//     }

//     static async getPassword() {
//         try {
//             const password = await this.getAttribute('password');
//             return password;
//         }
//         catch (error) {
//             throw error;
//         }
//     }
// }

// module.exports = ActiveUser;
