/**
 * JSmartObject
 */
import * as d3 from "d3";

export const JSmartObject = Object.create(null);

JSmartObject.draw = function(context, d){
    context.attr("d", d);
};

function getSVG(context){
    return context.select(function () {
        let ele = this;
        while(ele.nodeName.toLowerCase() !== "svg"){
            ele = ele.parentNode;
        }
        return ele;
    })
}

/**
 * @return d attr of path obj
 *
 * config object:
 * attributes
 *
 * height       :Number                         height of the blockArrow
 * width        :Number                         width of the blockArrow
 * angle        :Number                         the angle of the triangle in deg
 */
JSmartObject.blockArrow = function ({height, width, angle}) {
    const offsetX = height / 2 / Math.tan(angle / 2 * 2 * Math.PI / 360);
    return "M0 0 L" + width + " 0 L" + (offsetX + width) + " " + height / 2 + " " + "L" + width + " " + height + " L0 " + height + " L" + offsetX + " " + height / 2 + " Z";
};

/**
 * @return d attr of path obj
 *
 * origin is the center of arc
 *
 * config object:
 * attributes
 *
 * innerR           :Number                         inner radius of the arc
 * outerR           :Number                         outer radius of the arc
 * angle            :Number                         the angle of the arc in deg
 */
JSmartObject.arc = function ({innerR, outerR, angle}) {

    // total angle consists of  arrow and arc part
    const angleArc = angle  / 180 * Math.PI;

    return `M0 ${outerR * -1} `
        + `A ${outerR } ${outerR} 0 ${angle > 180 ? 1: 0} 1 ${outerR * Math.sin(angleArc)} ${outerR * Math.cos(angleArc) * - 1} `
        + `L ${innerR * Math.sin(angleArc)} ${innerR * Math.cos(angleArc) * -1} `
        + `A ${innerR } ${innerR} 0 ${angle > 180 ? 1: 0} 0 0 ${innerR * - 1} `
        + `Z`
};


/**
 * @return d attr of path obj
 *
 * origin is the center of arc
 *
 * config object:
 * attributes
 *
 * innerR           :Number                         inner radius of the arc
 * outerR           :Number                         outer radius of the arc
 * angle            :Number                         the angle of the arc in deg
 */
JSmartObject.arcArrow = function ({innerR, outerR, angle}) {

    // total angle consists of  arrow and arc part
    const angleOfArrow = Math.min( angle * 0.2 , 20);
    const angleArc = (angle - angleOfArrow) / 180 * Math.PI;

    // the percentage of arrow bottom to outR - innerR
    const arrowBottom = 1.8;
    const width = outerR -innerR;
    const deltaX = width * Math.sin(angleArc) * arrowBottom / 2 ;
    const deltaY = width * Math.cos(angleArc) * arrowBottom / 2 * -1;


    // middle lane
    const midR = (innerR + outerR) / 2;
    const topTosrc = midR / Math.cos(angleOfArrow / 180 * Math.PI);



    return `M0 ${outerR * -1} `
        + `A ${outerR } ${outerR} 0 ${angle > 180 ? 1: 0} 1 ${outerR * Math.sin(angleArc)} ${outerR * Math.cos(angleArc) * - 1} `
        + `L ${midR * Math.sin(angleArc) + deltaX} ${midR * Math.cos(angleArc)  * -1 + deltaY} `
        + `L ${topTosrc * Math.sin(angle/180 * Math.PI)} ${topTosrc * Math.cos(angle/180 * Math.PI) * -1} `
        + `L ${midR * Math.sin(angleArc) - deltaX} ${midR * Math.cos(angleArc)  * -1 - deltaY} `
        + `L ${innerR * Math.sin(angleArc)} ${innerR * Math.cos(angleArc) * -1} `
        + `A ${innerR } ${innerR} 0 ${angle > 180 ? 1: 0} 0 0 ${innerR * - 1} Z`
};



/**
 * @return d attr of path obj
 *
 * origin is the center of arc
 *
 * config object:
 * attributes
 *
 * innerR           :Number                         inner radius of the arc
 * outerR           :Number                         outer radius of the arc
 * angle            :Number                         the angle of the arc in deg
 */
JSmartObject.curveArrow = function ({innerR, outerR, angle}) {

    // total angle consists of  arrow and arc part
    const angleOfArrow = Math.min( angle * 0.2 , 20);
    const angleArc = (angle - angleOfArrow) / 180 * Math.PI;

    // the percentage of arrow bottom to outR - innerR
    const arrowBottom = 1.8;
    const width = outerR -innerR;
    const deltaX = width * Math.sin(angleArc) * arrowBottom / 2 ;
    const deltaY = width * Math.cos(angleArc) * arrowBottom / 2 * -1;
    const curved = 0.8;


    // middle lane
    const midR = (innerR + outerR) / 2;
    const topTosrc = midR / Math.cos(angleOfArrow / 180 * Math.PI);


    return `M0 ${outerR * -1} `
        + `A ${outerR } ${outerR} 0 ${angle > 180 ? 1: 0} 1 ${outerR * Math.sin(angleArc)} ${outerR * Math.cos(angleArc) * - 1} `
        + `L ${midR * Math.sin(angleArc) + deltaX} ${midR * Math.cos(angleArc)  * -1 + deltaY} `
        + `L ${topTosrc * Math.sin(angle/180 * Math.PI)} ${topTosrc * Math.cos(angle/180 * Math.PI) * -1} `
        + `L ${midR * Math.sin(angleArc) - deltaX} ${midR * Math.cos(angleArc)  * -1 - deltaY} `
        + `L ${innerR * Math.sin(angleArc)} ${innerR * Math.cos(angleArc) * -1} `
        + `A ${innerR * curved} ${innerR} 0 0 0 0 ${outerR * - 1}`
};




/**
 * config object:
 * attributes
 * height       :Number                         height of the blockArrow
 * width        :Number                         width of the blockArrow
 * angle        :Number                         the angle of the triangle in deg
 */
JSmartObject.arrow = function (config) {

    const offsetX = config.height / 2 / Math.tan(config.angle / 2 * 2 * Math.PI / 360);
    return "M0 " + config.width + " L" + config.height / 2 + " " + (config.width - offsetX) + " " +
        "L" + config.height / 4 + " " + (config.width - offsetX) + " L" + config.height / 4 + " " + 0 + " L" + (config.height / -4) + " " + 0
        + " L" + config.height / -4 + " " + (config.width - offsetX) + " L" + config.height / -2 + " " + (config.width - offsetX)
        + " Z";
};


/*
hexagon

origin is at the center of hexagon
width : 2*x
height: sqrt(3) * x
 */

JSmartObject.hexagon = function (config) {
    /**
     * config object:
     * attributes
     * len          :Number                         len
     */
    const sqrt3 = Math.sqrt(3) / 2 * config.len;
    return "M" + config.len + " " + 0 + " L" + config.len / 2 + " " + sqrt3 + " " +
        "L" + config.len / -2 + " " + sqrt3 + " L" + config.len * -1 + " " + 0 + " L" + config.len / -2 + " " + sqrt3 * -1
        + " L" + config.len / 2 + " " + sqrt3 * -1
        + " Z";
};


/**
 *
 * origin is at the top of the triangle
 *
 * @param height Number the height of the complete triangle
 * @param width Number the width of the complete triangle
 * @param levelTotal Integer the total level to be sliced vertically
 * @param levelTarget Integer, from 1 to levelTotal
 *
 * @return String  d attr of path of the single layer of the pyramid
 *
 */

JSmartObject.pyramid = function({height, width, levelTotal, levelTarget}){
    const n0 = 1 - levelTarget / levelTotal;
    const n1 = 1 - (levelTarget - 1) / levelTotal;
    const w = width / 2;
    const h = height;

    return `M${w * n0} ${h * n0} L ${w * n0 * -1} ${h * n0} L ${w * n1 * -1} ${h * n1} L ${w * n1} ${h * n1} Z`;
};


/**
 *
 * @param container d3-Object   the container to be operated in
 * @param r         Number      radius of gear face
 * @param n         Integer     number of teeth
 */
JSmartObject.gear= function (container, {r, n}) {
    container.selectAll("path").data(Array.from({length: n})).enter().append("path")
        .attr("d", () => tooth({r}))
        .attr("transform", (_, i) => "rotate(" + i * 360 / n +  ", 0, 0)");

    container.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", r)
        .attr("stroke", null)
    ;
};


let tooth  = function({r}){
    const alpha = 20;
    const width = 0.7;
    const height = 0.25;
    const h = Math.min(50, r * height);

    const angle = (alpha / 2) / 180 * Math.PI;
    const x = r * Math.sin(angle);
    const y = r * Math.cos(angle);

    return `M${x * -1} ${y* -1} A ${r} ${r} 0 0 1 ${x} ${y* -1} L ${x * width} ${ r * -1 - h} L ${x * width * -1} ${ r * -1 - h} Z`

};

/*
 http://stackoverflow.com/questions/13069446/simple-fill-pattern-in-svg-diagonal-hatching

 <svg:defs>
 <svg:pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45 2 2)">
 <svg:path d="M -1,2 l 6,0" stroke="#000000" stroke-width="1"/>
 </svg:pattern>
 </svg:defs>
 */

let count = 0;

JSmartObject.fillDiagonal = function (context) {

    let svg = getSVG(context);

    let defs = ! svg.select("defs").empty() ?
        svg.select("defs") :
        svg.append("defs");

    let id_ = `fillDiagonal${count++}`;

    defs.append("pattern")
        .attr("id", id_)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", "4")
        .attr("height", "4")
        .attr("patternTransform", "rotate(45 2 2)")
        .append("path")
        .attr("d", "M -1,2 l 6,0")
        .attr("stroke", "#000000")
        .attr("stroke-width", 1)
    ;

    context.attr("fill", "url(#" + id_ + ")");
};


/*
 <defs>
   <filter id="f1" x="-40%" y="-40%" height="200%" width="200%">
        <feOffset result="offOut" in="SourceAlpha" dx="0" dy="4" />
        <feGaussianBlur id="blur1" result="blurOut" in="offOut" stdDeviation="10" />
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
    </filter>
</defs>
  <rect width="90" height="90" stroke="green" stroke-width="3" fill="teal" filter="url(#f1)" />
 */
JSmartObject.dropShadow = function ({ x = -0.25, y = -0.25, width = 1.5, height = 1.5, dx = 3, dy = 3, stdDv = 2.5, apply = true }) {

    return (context) => {
        let svg = getSVG(context);

        let defs = ! svg.select("defs").empty() ?
            svg.select("defs") :
            svg.append("defs");

        let id_ = `dropShadow${count++}`;

        let filter = defs.append("filter").attr("id", id_)
            .attr("x", `${x}`)
            .attr("y", `${y}`)
            .attr("width", `${width}`)
            .attr("height", `${height}`);

        filter.append("feOffset")
            .attr("result", "offOut")
            .attr("in","SourceAlpha")
            .attr("dx", `${dx}`)
            .attr("dy", `${dy}`);

        filter.append("feGaussianBlur")
            .attr("result", "blurOut")
            .attr("in","offOut")
            .attr("stdDeviation", `${stdDv}`);

        filter.append("feBlend")
            .attr("in", "SourceGraphic")
            .attr("in2", "blurOut")
            .attr("mode", "normal");

        if(apply)
            context.attr("filter", "url(#" + id_ + ")");

        return "url(#" + id_ + ")";
    }
};


/*
 <filter id="glow">
    <fegaussianblur class="blur" result="coloredBlur" stddeviation="4"></fegaussianblur>
    <femerge>
        <femergenode in="coloredBlur"></femergenode>
        <femergenode in="coloredBlur"></femergenode>
        <femergenode in="coloredBlur"></femergenode>
        <femergenode in="SourceGraphic"></femergenode>
    </femerge>
</filter>
 */
JSmartObject.glow = function (stdDv = 2.5) {

    return (context) => {
        let svg = getSVG(context);

        let defs = ! svg.select("defs").empty() ?
            svg.select("defs") :
            svg.append("defs");

        let id_ = `glow${count++}`;
        let filter = defs.append("filter").attr("id", id_);

        filter.append("feGaussianBlur")
            .attr("result", "coloredBlur")
            .attr("stdDeviation", `${stdDv}`);

        let merge = filter.append("feMerge");
        merge.append("feMergeNode").attr("in", "coloredBlur");
        merge.append("feMergeNode").attr("in", "coloredBlur");
        merge.append("feMergeNode").attr("in", "coloredBlur");
        merge.append("feMergeNode").attr("in", "SourceGraphic");

        context.attr("filter", "url(#" + id_ + ")");
    }

};

JSmartObject.reflection = function (stdDv = 2.5, x = -1, y = 1, rotate = -45) {

    return (context) => {
        d3.select(context.node().parentNode.insertBefore(context.node().cloneNode(true), context.node().nextSibling))
            .attr("transform", `scale(${x}, ${y})rotate(${rotate})`).call(JSmartObject.glow(stdDv))
        ;
    }

};

/**
 *
 * @param context   the containing-D3 element
 * @param anchor    object  the position of the tooltip, with attr x, y
 * @param config
 */

JSmartObject.tooltip = function(context, anchor = {x: 0, y: 0}, config = {}, text = ""){
    let fontSize = config.fontSize || 15;

    let f =  context.append("g").classed("tooltip", true)
        .attr("transform",
            `translate(${anchor.x}, ${anchor.y})`
        );

    let p = f.append("path");

    let t = f.append("text").classed("tooltip-text", true).text(text).attr("font-size", fontSize);

    // get the text length dynamically
    let dimension = t.node().getBBox();

    let height = config.height || dimension.height * 2;
    let percentTriangleHeight = 0.5;
    let width = config.width || (dimension.width + 1 * fontSize);
    let borderThickness = config.borderThickness || 2;
    let borderColor = config.borderColor || "grey";
    let angle = config.angle || 120;
    let cornerRadius = config.cornerRadius || Math.min(8, height * 0.15);
    let orientation = config.orientation || "right";


    const offsetY = height * percentTriangleHeight / 2;
    const offsetX = offsetY / Math.tan(angle / 2 * 2 * Math.PI / 360);

    const rotate = {
        "right" : 0,
        "up" : -90,
        "left" : 180,
        "bottom" : 90,
    };

    t.attr("x", (orientation === "left"? -1 : 1) * (offsetX + fontSize * 0.5))
        .attr("y",offsetY + height / 2 - fontSize * 1.6)
        .attr("text-anchor" , orientation === "left"? "end" : "start")
    ;

    const p0 =  `M0 0 `
        + `L ${offsetX} ${-1 * offsetY} `
        + `L ${offsetX} ${(height / 2 - cornerRadius) * - 1} `
        + `A ${cornerRadius} ${cornerRadius} 0 0 1 ${ offsetX + cornerRadius } ${ height / 2 * -1 } `  // rounded corner up left
        + `L ${offsetX + width - cornerRadius} ${ height / 2 * -1 } `
        + `A ${cornerRadius} ${cornerRadius} 0 0 1 ${ offsetX + width } ${ (height / 2 - cornerRadius) * -1 } `  // rounded corner up right
        + `L ${offsetX + width} ${ height / 2 - cornerRadius } `
        // the upper half
        + `A ${cornerRadius} ${cornerRadius} 0 0 1 ${offsetX + width - cornerRadius} ${ height / 2 } `  // rounded corner up right
        + `L ${offsetX + cornerRadius} ${ height / 2 } `
        + `A ${cornerRadius} ${cornerRadius} 0 0 1 ${offsetX} ${(height / 2 - cornerRadius) } `  // rounded corner up left
        + `L ${offsetX} ${offsetY} `
        + " Z"
    ;

    const p1 = `M0 0 `
        + `L ${offsetX * -1} ${offsetY} `
        + `L ${offsetX * -1} ${(height / 2 - cornerRadius)} `
        + `A ${cornerRadius} ${cornerRadius} 0 0 1 ${ -1* (offsetX + cornerRadius) } ${ height / 2 } `  // rounded corner up left
        + `L ${ (offsetX + width - cornerRadius) * -1} ${ height / 2 } `
        + `A ${cornerRadius} ${cornerRadius} 0 0 1 ${ -1* (offsetX + width) } ${ (height / 2 - cornerRadius)  } `  // rounded corner up right
        + `L ${-1 * (offsetX + width) } ${ -1* (height / 2 - cornerRadius) } `
        // the upper half
        + `A ${cornerRadius} ${cornerRadius} 0 0 1 ${-1* (offsetX + width - cornerRadius)} ${ height / -2 } `  // rounded corner up right
        + `L ${-1 * (offsetX + cornerRadius)} ${ height / -2 } `
        + `A ${cornerRadius} ${cornerRadius} 0 0 1 ${offsetX * -1} ${(height / 2 - cornerRadius) * -1 } `  // rounded corner up left
        + `L ${offsetX * -1} ${offsetY * -1} `
        + " Z"
    ;

    p.attr("d", orientation === "right" ? p0 : p1)
        .attr("fill", "white").attr("stroke", borderColor).attr("stroke-width", borderThickness)
        .attr("stroke-dasharray", 1000).attr("stroke-dashoffset", 1000)
    //   .attr("transform", `rotate(${rotate[orientation]})`)
        .classed("tooltip-border", true)
    ;


    return f;

};

/**
 * @return d attr of path obj
 *
 * @param config    the style config of the shape
 * config object:
 * attributes
 *
 * height       :Number                         height of the blockArrow
 * width        :Number                         width of the blockArrow
 * angle        :Number                         the angle of the triangle in deg
 * marginLeft  :Number                         the left margin of time axis
 * marginTop   :Number                         the top margin of time axis
 *
 *
 * @param events    the array of event obj
 *
 * attr of event
 *
 * date:    Date    the date of the event
 * name:    String  the name of the event
 * desc:    String  the description of the event
 * pic:     String  path of the pic
 *
 * @param context   the container d3-DOM obj
 *
 */
JSmartObject.timeline = function (context, config, events) {
    let height = config.height || 10;
    let width = config.width || 600;
    let angle = config.angle || 15;
    let marginLeft = config.marginLeft || 200;
    let marginTop = config.marginTop || 100;
    let marginBlank = 20;
    let dotRadius = 6;
    let tooltipBorderColor = config.borderColor || "DodgerBlue";
    let dateLabelFontSize = config.dateLabelFontSize || 10;
    let tooltipFontSize = config.tooltipFontSize || 15;

    let axis =context.append("path").attr("d", JSmartObject.arrow(
        {
            height: height,
            width:  width,
            angle:  angle
        }
        )
    ).attr("fill", "grey").attr("transform", `translate(${marginLeft}, ${marginTop})`);


    let shadow1 = null;

    let eventsGroup = context.append("g").classed("events", true).selectAll("g").data(events).enter().append("g");

    eventsGroup.append("circle").attr("cx", marginLeft).attr("cy", (d, i) => marginTop + marginBlank + i * 80 ).attr("r", dotRadius)
        .attr("fill", "grey");
    eventsGroup.append("circle").attr("cx", marginLeft).attr("cy", (d, i) => marginTop + marginBlank + i * 80 ).attr("r", dotRadius * 0.6)
        .attr("fill", "white");

    eventsGroup.each(function (p, j) {
        d3.select(this).call(JSmartObject.tooltip,
            {x: 0, y:0},
            {borderColor: tooltipBorderColor, orientation: j & 1 ? "left" : "right", fontSize: tooltipFontSize},
            p.name
        );

        d3.select(this).selectAll(".tooltip-text").style("display", "none");
    });

    let formatDate = d3.timeFormat("%Y-%m-%d");

    let dateLabel = eventsGroup
        .append("text").text((d)=>formatDate(d.date))
        .attr("font-size", dateLabelFontSize)
        .attr("x", (_,i) => marginLeft + dotRadius * 2.5 + (i & 1? 0: dotRadius * - 5))
        .attr("y",(_, i) => marginTop + marginBlank + i * 80 + dateLabelFontSize / 2)
        .attr("text-anchor" , (_, i) => i & 1?  "start": "end")
        .style("cursor", "pointer")
    ;

    let f = eventsGroup.selectAll(".tooltip");
    let e = f.selectAll(".tooltip-border");
    let t = f.selectAll(".tooltip-text");

    f.attr("transform", function (d) {
        let j = d.id;
        return `translate(${marginLeft + dotRadius * 2.5 + (j & 1? dotRadius * - 5 : 0)},${marginTop + marginBlank + j * 80 })`
    });

    function showTooltip(i){
        let e1 = e.filter((d)=> i === null || d.id === i);
        e1.transition().duration(2000).attr("stroke-dashoffset", 0);
        e1.transition().delay(2000).attr("fill", "white")
            .attr("filter", function (d,j) { return shadow1; })
        ;

        t.filter((d)=> i === null || d.id === i).style("opacity", 0).style("display", null).transition().duration(2000).style("opacity", 1);
    }

    let current = null;

    function hideTooltip(i){

        if(current !== i && current != null){
            showTooltip(i);
        }

        let e1 = e.filter((d) => d.id !==i );
        e1.transition().duration(1000).attr("stroke-dashoffset", 1000);
        e1.transition().delay(1000).attr("fill", "none");

        e1.attr("filter", null);

        let t1 = t.filter((d) => d.id !==i );
        t1.transition().duration(1000).style("opacity", 0);
        t1.transition().delay(1000).style("display", "none");

        current = i;
    }

    showTooltip(null);

    eventsGroup.append("circle").attr("cx", marginLeft).attr("cy", (d, i) => marginTop + marginBlank + i * 80 ).attr("r", dotRadius * 2.5)
        .attr("fill", "grey")
        .style("opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", function (d, i) {
            d3.select(this).transition().duration(500).style("opacity", 0.3);

            //showTooltip(d.id);
        })
        .on("mouseleave", function () {
            d3.select(this).transition().duration(200).style("opacity", 0);

            //hideTooltip()
        })
        .on("click", function (d) {
            hideTooltip(d.id);
        })
    ;

    axis.on("click", ()=> {showTooltip(null); current = null});

    dateLabel.on("click", (d)=> hideTooltip(d.id));

    // let cnt = 0; context.on("click", ()=> cnt++ & 1 ? showTooltip() : hideTooltip())
};


/**
 * @param context   the container d3-DOM obj
 */


JSmartObject.waterfall = function (context, data, config = {
    bandWidth: 40,
    bandMargin: 5,
    colorPositive: "#393b79",
    colorNegative: "#aec7e8",
    margin: {top: 100, right: 200, bottom: 100, left: 50},
    width: 700,
    height: 500
} ) {
    let data1 = data || [
        {
            "Umsatzerlöse": 95.159,
            "Materialaufwand": -36.340,
            "Personalaufwand": -27.217 - 4.667,
            "SbA": -15.201,
            "Abschreibungen": -1.383,
            "Zinsergebnisse": 0.292-0.159,
            "Beteiligungsergebnisse":0.063,
            "Sonstige Erlöse":1.658,
            "Steueraufwandungen":-4.28,
            "Konzernjahresergebnis":-7.92
        }
    ];

    var bandWidth = config.bandWidth || 40;
    var bandMargin = config.bandMargin || 5;
    var colorPositive = config.colorPositive ||  "#393b79";
    var colorNegative = config.colorNegative || "#aec7e8";
    var keys = Object.getOwnPropertyNames(data1[0]);

    var stack = d3.stack().keys(keys);

    var margin = config.margin || {top: 100, right: 200, bottom: 100, left: 50},
        width = (config.width || 700) - margin.left - margin.right,
        height = (config.width || 500) - margin.top - margin.bottom;

    var x = function (i) {
        return bandWidth * i + bandMargin * (i+1) + margin.left;
    };

    // total amount is the first element by default
    var totalY = data1[0][keys[0]]

    var y = d3.scaleLinear([totalY, 0], [height, 0]);

    var svg = context
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var layer = svg.selectAll(".layer")
        .data(stack(data1).map(function(e, i, arr){
            var hi = y(Math.abs(e[0][1] - e[0][0]));
            e["y"] = e[0]["data"][e["key"]];
            e["x"] = e["index"];
            e["label"] =  d3.format(".2f")(e[0]["data"][e["key"]]);


            //y0 the y pos of upper left point
            //y1 the starting pos of next rect
            e['height'] = hi;
            if(i===0){
                e['y1'] = 0;
                e['y0'] = 0;
            }
            else{
                e['y1'] = arr[i-1]['y1']+ (e.y > 0? -1 * hi: hi);
                e['y0'] = e.y > 0? e['y1']: arr[i-1]['y1'];
            }

            return e;
        }))
        .enter().append("g")
        .attr("class", "layer")
    ;

    var rect = layer.append("rect")
        .attr("x", function(d,i){ return x(!i? i : 1);})
        .attr("y", height)
        .style("fill", function (d) {

                if (d.y > 0)
                    return colorPositive;

                return colorNegative;


        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .attr("width", bandWidth)
        .attr("height", 0)
        .on("click", function (d) {
            // console.log(d);
        });

    rect.transition()
        .delay(function (d, i) {
            return i * 10;
        })
        .duration(800)
        .attr("y", function (d) {
            return d.y0;
        })
        .attr("height", function (d) {
            return d.height;
        });
    rect.transition()
        .delay(function (d, i) {
            return i * 50 + 800;
        })
        .attr("x", function (d, i) {
            return x(i);
        })
    ;


    setTimeout(function () {
        layer
            .append("text")
            .attr("transform", function(d){ return "translate("+ [x(d.x) + bandWidth / 2, height+10 ]+")rotate(30)";})
            .text(function (d) {
                return d.key;
            })
            .style("font-size", "10px")
            .attr("text-anchor", "start")
        ;

        layer
            .append("text")
            .attr("transform", function(d){ return "translate("+ [x(d.x) + bandWidth / 2, d.y0-5 ]+")";})
            .text(function (d) {
                    return d.label;
            })
            .style("font-size", "10px")
            .attr("text-anchor", "middle")
        ;

        layer
            .append("text")
            .attr("transform", function(d){ return "translate("+ [x(d.x) + bandWidth / 2, d.y0+d.height/2 ]+")";})
            .text(function (d) {
                var val = Math.abs(d.y/totalY);
                if(val > 0.05)
                    return d3.format(".1%")(val);

                return null;
            })
            .style("font-size", "10px")
            .attr("fill","#fff")
            .attr("text-anchor", "middle")
        ;

        svg.append("line")
            .attr("x2", margin.left)
            .attr("y2", height)
            .attr("x1", margin.left)
            .attr("y1", height)
            .attr("stroke","#000")
            .attr("stroke-width", 1)
            .transition()
            .delay(100)
            .duration(500)
            .attr(
                "x2", bandWidth * 1.5 + x(keys.length - 1)
            );

        svg.append("text")
            .attr("x",  bandWidth * 1.5 + x(keys.length - 1) )
            .attr("y",  -40)
            .attr("text-anchor",  "end")
            .style("font-size", "10px")
            .text("in Mio. €");


    }, 800)
}