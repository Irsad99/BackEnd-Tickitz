const bcr = require('bcrypt');

const HashPass = async (password) => {
    try {
        const salt = await bcr.genSalt(10);
        const res = await bcr.hash(password, salt);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = HashPass;