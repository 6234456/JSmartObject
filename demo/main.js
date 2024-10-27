import * as d3 from "d3";
import {JSmartObject} from "../src";

(function(){
    let setStage = function (id) {
        const margin = {top: 20, left: 30, right: 20, bottom: 120},
            height = 800 - margin.top - margin.bottom,
            width = 800 - margin.right - margin.left,
            svg = d3.select(id)
                .append("svg")
                .attr("height", (height + margin.top + margin.bottom))
                .attr("width", (width + margin.right + margin.left));
    };

    (function(id) {
        setStage(id);

        d3.select(id + " svg").append("g").call(
            JSmartObject.timeline,
            {marginLeft: 180, marginTop: 30, borderColor: "grey", tooltipFontSize: 12},
            [
                {name : "Hello World", date: new Date("2018-12-8"), desc: "", id: 0},
                {name : "Rebirth", date: new Date("2018-12-16"), desc: "", id: 1},
                {name : "Expand Your Boundary", date: new Date("2018-12-23"), desc: "", id: 2},
                {name : "Hit the track", date: new Date("2018-12-31"), desc: "", id:3}
            ]
        ).selectAll(".tooltip-border");
    })("#time-line");
})();