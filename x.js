const { rename } = require("fs-extra");

changeEnvironment();

async function changeEnvironment() {
    try {
        await rename(__dirname + '/environment/environment.prod.ts', __dirname + '/environment/environment.ts');
    } catch(e) {
        console.error(e);
    }
}

