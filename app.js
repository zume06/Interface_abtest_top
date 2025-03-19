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
        outfile = `mixquery_2025sp_abtest_top_${name}.csv`;
        init();

    }
    function Display() {
        document.getElementById("Display1").style.display = "none";
        document.getElementById("Display2").style.display = "block";
    }

    function setButton() {
        radio_checked = false;

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
        var test_no_ = set_no_array[n];
        result.push([test_no_, file_paths["a"], file_paths["b"], choice, truth])
        console.log("result", result);
    }

    function setAudio() {
        $("#page").text(`${n + 1}/${set_no_array.length}`);
        var test_no = set_no_array[n]
        num_query = set_dict[test_no]["num_query"];
        for (var i = 0; i < num_query; i++) {
            $(`#inst_display${i}`).text(set_dict[test_no][`query${i}`]["inst"]);
            $(`#play_query${i}`).html(`<br><audio src="${set_dict[test_no][`query${i}`]["audio_path"]}" controls preload="auto"></audio>`);
        }

        if (num_query < 3) {
            $("#audio_cont2").css("display", "none");
        } else {
            $("#audio_cont2").css("display", "block");
        };

        $(`#play_retrieved_a`).html(`A:<br><audio src="${set_dict[test_no]["a"]}" controls preload="auto"></audio>`);
        $(`#play_retrieved_b`).html(`B:<br><audio src="${set_dict[test_no]["b"]}" controls preload="auto"></audio>`);

        file_paths = { "a": set_dict[test_no]["a"], "b": set_dict[test_no]["b"] };
        truth = set_dict[test_no]["true"];
    }

    function exportCSV() {
        var csvData = "";
        csvData += "test_id,path_a,path_b,choice,true\r\n";
        for (var i = 0; i < result.length; i++) {
            csvData += `${result[i][0]},${result[i][1]},${result[i][2]},${result[i][3]},${result[i][4]}\r\n`;
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
        choices = [];
        setAudio();
        setButton();
    }

    function next() {
        evalRecord();
        console.log(result);
        n++;
        choices = [];
        setAudio();
        setButton();
    }

    function prev() {
        n--;
        result.splice(n, 1);
        console.log(result);
        setAudio();
        setButton();
    }

    function finish() {
        evalRecord();
        n++;
        exportCSV();
    }

    function ansCheck() {
        if (radio_checked == true) {
            if (n == (set_no_array.length - 1)) {
                $("#finish").prop("disabled", false);
            }
            else {
                $("#next").prop("disabled", false);
            }
        }
    }

    let set_dict;
    let n = 0;
    let result = [];
    let choices;
    let set_no_array = [];
    let outfile;
    let file_paths = {}
    let truth;
    let radio_checked;
    let choice;
    let num_query;

    $.getJSON("./data/file_list.json", function (d) {
        set_dict = d
        console.log(set_dict);
        for (let i = 0; i < Object.keys(set_dict).length; i++) {
            set_no_array.push(i);
        }
        set_no_array.shuffle();
        console.log("set_no_array", set_no_array);
    });


    $("#start").on("click", function () {
        start_experiment();
    });

    $("#next").on("click", function () {
        console.log(choices);
        next()
    });

    $("#prev").on("click", function () {
        prev()
    });

    $("#finish").on("click", function () {
        finish()
    });

    $(".radio_btn").on("click", function () {
        radio_checked = true;
        $(".radio_btn").not(this).prop("checked", false);
        ansCheck();
        choice = $(this).attr("score");
        console.log("choice", choice);
    });


});