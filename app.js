let fs = require('fs');
let files = fs.readdirSync('./icons/ionicon');
let ionicon = files.map(i => {
    let name = i.replace('.svg', '').split("-").join(" ");
    return { name: name, url: `./icons/ionicon/${i}` }
})
files = fs.readdirSync('./icons/CSS-Icons');
let icon_css = files.map(i => {
    let name = i.replace('.svg', '').split("-").join(" ");
    return { name: name, url: `./icons/CSS-Icons/${i}` }
})
let data = [].concat(ionicon, icon_css);
console.log(data.length)
fs.writeFileSync("icons.json", JSON.stringify(data));