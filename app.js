$(document).ready(function () {
    Array.prototype.shuffle = function () {
        var i = this.length;
        while (i) {
            var j = Math.floor(Math.random() * i);
            var t = this[--i];
            this[i] = this[j];
            this[j] = t;
        }
        return this;
    }

    function invalid_enter() {
        if (window.event.keyCode == 13) {
            return false;
        }
    }

    function start_experiment() {
        // get user name
        var name = document.getElementById("name").value.replace(" ", "_");
        if (name == "") {
            alert("Please enter your name.");
            return false;
        }
        Display();
        outfile = `mixquery_2025sp_fiveeval_${name}.csv`;
        init();

    }
    function Display() {
        document.getElementById("Display1").style.display = "none";
        document.getElementById("Display2").style.display = "block";
    }

    function setButton() {
        $(".radio_btn").prop("checked", false);
        if (n == 0) {
            $("#prev").prop("disabled", true);
        }
        else {
            $("#prev").prop("disabled", false);
        }
        $("#next").prop("disabled", true);
        $("#finish").prop("disabled", true);
    }

    function evalRecord() {
        result.push([set_no_array[n - 1], choice])
        console.log(result);
    }

    function setAudio() {
        var test_no = set_no_array[n]
        let num_query = set_dict[test_no]["num_query"];
        console.log(set_dict[test_no]["query0"]["audio_path"]);
        for (var i = 0; i < num_query; i++) {
            console.log(i);
            $(`#play_query${i}`).html(`${set_dict[test_no][`query${i}`]["inst"]} sound:<br><audio src="${set_dict[test_no][`query${i}`]["audio_path"]}" controls preload="auto"></audio>`);
        }
        $(`#play_retrieved`).html(`song:<br><audio src="${set_dict[test_no]["retrieved"]["audio_path"]}" controls preload="auto"></audio>`);

    }

    function exportCSV() {
        var csvData = "";
        csvData += "test_id,score\r\n";
        for (var i = 0; i < result.length; i++) {
            csvData += `${result[i][0]},${result[i][1]}\r\n`;
        }
        const link = document.createElement("a");
        document.body.appendChild(link);
        link.style = "display:none";
        const blob = new Blob([csvData], { type: "octet/stream" });
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = outfile;
        link.click();
        window.URL.revokeObjectURL(url);
        link.parentNode.removeChild(link);
    }

    function init() {
        n = 0;
        setAudio();
        setButton();
    }

    function next() {
        n++;
        setAudio();
        evalRecord();
        setButton();
    }

    function prev() {
        n--;
        setAudio();
        evalRecord();
        setButton();
    }

    function finish() {
        n++;
        evalRecord();
        exportCSV();
    }

    let set_dict;
    let n = 0;
    let result = [];
    let choice;
    let set_no_array = [];
    let outfile;

    $.getJSON("./data/database.json", function (d) {
        set_dict = d
        console.log(set_dict);
        for (let i = 0; i < Object.keys(set_dict).length; i++) {
            set_no_array.push(i);
        }
        set_no_array.shuffle();
        console.log(set_no_array);
    });


    $("#start").on("click", function () {
        start_experiment();
    });

    $("#next").on("click", function () {
        next()
    });

    $("#prev").on("click", function () {
        prev()
    });

    $("#finish").on("click", function () {
        finish()
    });

    $(".radio_btn").on("click", function () {
        if (n == (set_no_array.length - 1)) {
            $("#finish").prop("disabled", false);
        }
        else {
            $("#next").prop("disabled", false);
        }
        $(".radio_btn").not(this).prop("checked", false);
        choice = $(this).attr("score");
    });

});