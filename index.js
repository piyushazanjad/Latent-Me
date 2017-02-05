/*"use strict";*/
/*jshint browser:true*/
/*globals $*/
/*jshint unused:false*/
var i = 1;
$(document).ready(function() { /*code here*/
    $("#prof_disp").addClass('hide');
    $("#showHide").click(function() {
        if ($(".password").attr("type") == "password") {
            $(".password").attr("type", "text");

        } else {
            $(".password").attr("type", "password");
        }
    });
    //when the Add Field button is clicked
    $("#add").click(function(e) {
        //Append a new row of code to the "#items" div 
        item_project = "<div class=\"project\">" +
            "<h6>Project Information</h6>" +
            "<input type=\"text\" class=\"title\" placeholder=\"Project Title\">" +
            "<input type=\"text\" class=\"domain\" placeholder=\"Project Domain\">" +
            "<input type=\"text\" class=\"desc\" placeholder=\"Description\">" +
            "</div>";
        $("#projectlist").append(item_project);
        i++;
    });



    $("body").on("click", ".delete", function(e) {
        $(this).parent("div").remove();
    });


});
var file_path;

function upload_image() {
    var formdata = new FormData();
    $.each($('#profile_file')[0].files, function(i, file) {
        formdata.append('userphoto', file);
    });
    $.ajax({
        type: "POST",
        url: "http://localhost:4000/api/photo",
        data: formdata,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            alert('Image Successfully Uploaded');
            file_path = data;
        },
        error: function(status) {
            alert(status);
        }
    });
}

var checkforinput = (function() {
    if ($("#p1")[0].value === "" && $("#u1")[0].value === "") {
        alert("Seems like you missed out on your username and password");
    } else {
        getting_from_json();
        //console.log("called")
    }
});

var user;
var getting_from_json = function() {
    var c = $("#u1").val();
    var d = $("#p1").val();
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/user",
        data: {
            username: c,
            password: d
        },
        dataType: "json",
        success: function(data) {
            if (data.length === 1) {
                //login success
                user = data[0];
                $('#modal1').closeModal();
                $('#content').removeClass("hide");
                $('#login_buttons').addClass("hide");
                $('#logout_buttons').removeClass("hide");
                $('#home_disp').addClass("hide");
                $('#prof_disp').removeClass("hide");
                showpage(user);
                //alert('Login Successful');
            } else {
                alert("Seems like the user doesn't exist!!");
            }
        },
        error: function(status) {
            alert(status);
        }
    });
};

var showpage = function(user) {
    $("#show_fn")[0].innerHTML = "<h5>Name: " + user.firstname + " " + user.lastname + "</h5>";
    console.log(user);
    //$("#show_ln")[0].innerHTML = user.lastname;
    $("#show_a")[0].innerHTML = "<h5>Age: " + user.age + "</h5>";
    //$("#show_dob")[0].innerHTML = user.dob;
    $("#show_ei")[0].innerHTML = "<h5>E-mail ID: " + user.emailid + "</h5>";
    $("#show_dob")[0].innerHTML = "<h5>Date of Birth: " + user.dob + "</h5>";

    $.each(user.skills.languages, function(i, item) {
        if (user.skills.languages.length - 1 === i)
            $("#show_lang")[0].innerHTML += item;
        else
            $("#show_lang")[0].innerHTML += item + ",";
    });

    $("#about_yourself")[0].innerHTML = user.about;

    $.each(user.skills.operatingsystems, function(i, item) {
        if (user.skills.operatingsystems.length - 1 === i)
            $("#show_os")[0].innerHTML += item;
        else
            $("#show_os")[0].innerHTML += item + ",";
    });

    $.each(user.skills.databases, function(i, item) {
        if (user.skills.databases.length - 1 === i)
            $("#show_db")[0].innerHTML += item;
        else
            $("#show_db")[0].innerHTML += item + ",";
    });

    $.each(user.skills.certificates, function(i, item) {
        if (user.skills.certificates.length - 1 === i)
            $("#show_ce")[0].innerHTML += item;
        else
            $("#show_ce")[0].innerHTML += item + ",";
    });

    $.each(user.projects, function(i, item) {
        var container = "<div class=\"col l4 m8 s12\">" +
            " <div class=\"card\">" +
            "<div class=\"card-image waves-effect waves-block waves-light\">" +
            "<h2 class=\"left-align card-title-top\">" + item.domain + "</h2>" +
            "<div class=\"card-img-wrap\">" +
            "<img class=\"activator\" src=\"images/ghost_rider.jpg\" alt=\"\">" +
            "</div>" +
            "</div>" +
            "<div class=\"card-content\">" +
            "<span class=\"card-title activator grey-text text-darken-4\">" + item.title + "<i class=\"material-icons right\">more_vert</i></span> " +
            "</div>" +
            "<div class=\"card-reveal\">" +
            "<span class=\"card-title grey-text text-darken-4\">" + item.title + "<i class=\"material-icons right\">close</i></span>" +
            "<p>" + item.desc + "</p>" +
            "</div>" +
            "</div>" +
            "</div>";
        $("#project_disp")[0].innerHTML += container;
    });


    var show_image = "<img height=\"350px\" width=\"350px\" class=\"materialboxed z-depth-1\" src=\"" + user.image_path + "\">";
    console.log(user.image_path);
    $("#content-image")[0].innerHTML += show_image;


};

var adding_to_json = function() {
    var db = $("#db").val().split(',');
    var os = $("#operating_system").val().split(',');
    var cf = $("#certi").val().split(',');
    var lang = $("#language").val().split(',');

    var projects = [];

    $.each($("#projectlist .project"), function(i, item) {
        var project = {};
        project.title = $(item).find("input.title").val();
        project.domain = $(item).find("input.domain").val();
        project.desc = $(item).find("input.desc").val();
        projects.push(project);
    });
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/user",
        data: JSON.stringify({
            "firstname": $("#first_name").val(),
            "lastname": $("#last_name").val(),
            "username": $("#username").val(),
            "password": $("#password").val(),
            "about": $("#yourself").val(),
            "age": $("#age").val(),
            "dob": $("#dob").val(),
            "emailid": $("#emailid").val(),
            "image_path": file_path,
            "skills": {
                "languages": lang,
                "operatingsystems": os,
                "databases": db,
                "certificates": cf
            },
            "projects": projects
        }),
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            $('#register').closeModal();
            $('#modal1').closeModal();
            $('#content').removeClass("hide");
            //showpage(data);  
            alert("Registration successful");
        },
        error: function(status) {
            alert("Registration Error");
        }
    });
};