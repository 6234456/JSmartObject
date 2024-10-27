import * as d3 from "d3";
import {JSmartObject} from "../src";

(function(){
    let setStage = function (id) {
        const margin = {top: 20, left: 30, right: 20, bottom: 120},
            height = 800 - margin.top - margin.bottom,
            width = 800 - margin.right - margin.left;
            return d3.select(id)
                .append("svg")
                .attr("height", (height + margin.top + margin.bottom))
                .attr("width", (width + margin.right + margin.left));
    };

    /*
    (function(id) {
        let context = setStage(id);
        JSmartObject.waterfall0(context,null,["value1"])
       //JSmartObject.blockArrowChain(setStage(id))
    })("#time-line");
     */
    (function(id) {
        let context = setStage(id);
        //JSmartObject.waterfall0(context,null,["value1"])
        //JSmartObject.blockArrowChain(context)
        JSmartObject.sankey(context, {
            links: [
                { source: "MBAG", target: "Main Operating Income", value: 523 },
                { source: "BMW", target: "Main Operating Income", value: 123 },
                { source: "VW", target: "Main Operating Income", value: 23 },
                { source: "Others", target: "Main Operating Income", value: 13 },
                { source: "Margin Loss_", target: "Main Operating Expense", value: 24 },
                { source: "Main Operating Expense", target: "Margin Loss", value: 24 },
                { source: "Main Operating Income", target: "Main Operating Expense", value: 523 + 123 + 23 + 13 },
            ]
        }, {
            nodeAlign: "left",
            linkColor: "source-target",
            nodeGroup: d => d.id.split(/\W/)[0],
            height: 600
        })
    })("#time-line");
})();