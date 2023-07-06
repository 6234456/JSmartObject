import * as d3 from "d3";
import {JSmartObject} from "../../index";

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

    (function(id) {
        let context = setStage(id);
        JSmartObject.waterfall0(context,null,["value1", "value2"])
       //JSmartObject.blockArrowChain(setStage(id))
    })("#time-line");
})();