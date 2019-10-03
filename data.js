const fs = require("fs")
// import data from "data.json"
let data = fs.readFileSync("data.json")
var newData = JSON.parse(data);
var key = [2015, 2016, 2017, 2018, 2019];
var topData = {
    name: "OutOfMyLens",
    children: []
}
key.map(x => {
    topData.children.push({
        name: x,
        children: []
    })
})
newData.map((x, index) => {
    var date = new Date(x.postedAt * 1000)
    var year = date.getFullYear(),
        childindex = key.findIndex((el) => el === year),
        aux = {
            "name": x.id,
            "code": x.code,
            "id": x.id,
            "numComments": x.numComments,
            "numLikes": x.numPreviewLikes,
            "src": x.src,
            "total": x.numComments + x.numPreviewLikes,
        };
    topData.children[childindex].children.push(aux);
})
fs.writeFile("newData.json", JSON.stringify(topData), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});