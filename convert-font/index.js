var fontnik = require('fontnik');
var fs = require('fs');
var path = require('path');
var glob = require("glob");


var convert = function(fileName, outputDir) {
    var font = fs.readFileSync(path.resolve(__dirname + "/" + fileName));
    output2pbf(font, 0, 255, outputDir);
}

function output2pbf(font, start, end, outputDir) {
    if (start > 65535) {
        console.log("done!");
        return;
    }
    fontnik.range({font: font, start: start, end: end}, function(err, res) {
        var outputFilePath = path.resolve(__dirname + "/" + outputDir + start + "-" + end + ".pbf");
        fs.writeFile(outputFilePath, res, function(err){
            if(err) {
                console.error(err);
            } else {
                output2pbf(font, end+1, end+1+255, outputDir);
            }
        });
    });
}

glob("./fonts/*/*.ttf", null, function (er, files) {
  var listFonts = {};
  for(var i=0; i<files.length; i++){
    var path = files[i].split("/");
    var group = path[path.length - 2].replace(/-/g, " ").replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    listFonts[group] = listFonts[group] || [];
    
    var name = path[path.length - 1].split(".")[0];
    listFonts[group].push(name);

    console.log("Converting font: "+name+"...");
    var folder = "./pbf/"+name;
    if(!fs.existsSync(folder)) fs.mkdirSync(folder);
    convert(files[i], folder+"/");
  }

  fs.writeFile('fonts.json', JSON.stringify(listFonts), 'utf8', function(err){
	});
});
