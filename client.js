const Brandwatch = require('./Brandwatch')

async function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function test(){
    const client = await Brandwatch.init("sam", "password")

    const response = await client.getProjects()
    console.log(response);
    await sleep(2000)
    await client.getProjects()
    await sleep(2000)
    await client.getProjects()
    await sleep(2000)
    await client.getProjects()
}

test()

