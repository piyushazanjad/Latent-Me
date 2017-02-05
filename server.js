var express = require("express");
var multer = require('multer');
var app = express();
var file_name;
var final_filepath;
app.use(express.static('.'));

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');

    },
    filename: function(req, file, callback) {
        var file_type = file.mimetype.split("/")[1];
        file_name = file.fieldname + '-' + Date.now() + '.' + file_type;
        callback(null, file_name);
        final_filepath = "/uploads/" + file_name;
    }
});
var upload = multer({
    storage: storage
}).single('userphoto');



app.post('/api/photo', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.send(final_filepath);
    });
});

app.listen(4000, function() {
    console.log("Working on port 4000");
});
