/**
 * JSmartObject
 */
import * as d3 from "d3";
import sankey from "d3-sankey";
import * as d3Sankey from "d3-sankey";

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

JSmartObject.blockArrowChain = function (context, config= {height:24, width:60, angle:110, gap:1, cnt:5, widerWidthAfterTrans:145}){
    const {
       width,
       height,
       angle,
       gap,
       cnt,
       widerWidthAfterTrans
    } = config

    const stage = context
    const p = JSmartObject.blockArrow({height: height, width: width, angle:angle})
    const totalWidth = width * cnt + (cnt - 1) * gap
    const narrowerWidthAfterTrans = (totalWidth - widerWidthAfterTrans - (cnt - 1) * gap ) / (cnt - 1)
    const path = stage.append("g").selectAll("path")
        .data(Array.from({length:cnt}).map((_,i)=>i))
        .enter()
        .append("path")
    let lenArr = Array.from({length:cnt}).map((_)=>width)
    let translateArr = () => lenArr.slice(0, -1).reduce((acc, e) => [ ...acc, acc[acc.length-1] + e + gap]  , [0])
    let tranArr = translateArr()

    path.attr("transform", (_, i) => `translate(${(width + gap)*i}, 0)`)
        .attr("d", p)
        .on("mouseover", (_,i)=>{
            const adjust = () => {
                lenArr = lenArr.map((_, index)=> index === i ? widerWidthAfterTrans: narrowerWidthAfterTrans)
                tranArr = translateArr()
            }

            path.transition().duration(500).attrTween("d", ( _, index)=>{
                return (t)=>{
                    const width = lenArr[index]
                    if (index === i)
                        return JSmartObject.blockArrow({height: height, width: width + t * (widerWidthAfterTrans - width), angle:110})
                    else
                        return JSmartObject.blockArrow({height: height, width: width + t * (narrowerWidthAfterTrans - width), angle:110})
                }
            }).attrTween("transform", (_, index) => {
                return (t)=>{
                    const trans = tranArr[index]
                    const newTrans = index <= i ?  (narrowerWidthAfterTrans + gap) * index : ((narrowerWidthAfterTrans + gap) * (index -1) + gap + widerWidthAfterTrans)

                    return `translate(${trans + (newTrans - trans) * t}, 0)`
                }
            }).on("end", ()=>{
                adjust()
            }).on("interrupt", () => {adjust()})
        })
}

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

JSmartObject.highlightBox = function (context, config = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
}) {
   context.append("rect").attr("fill", "#ccc").attr("stroke", "#000").style("opacity", "0.15").attr("stroke-dasharray", "3 1")
       .attr("x", config.x)
       .attr("y", config.y)
       .attr("width", config.width)
       .attr("height", config.height)
}

/**
 * <svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
 *   <defs>
 *     <!-- A marker to be used as an arrowhead -->
 *     <marker
 *       id="arrow"
 *       viewBox="0 0 10 10"
 *       refX="3"
 *       refY="3"
 *       markerWidth="6"
 *       markerHeight="6"
 *       orient="auto-start-reverse">
 *       <path d="M 0 0 L 10 3 L 0 6 z" />
 *     </marker>
 *   </defs>
 *
 *   <!-- A curved path with markers -->
 *   <path
 *     d="M 110 10
 *        C 120 20, 130 20, 140 10
 *        C 150 0, 160 0, 170 10
 *        C 180 20, 190 20, 200 10"
 *     stroke="black"
 *     fill="none"
 *     marker-end="url(#arrow)" />
 * </svg>
 */

JSmartObject.arrowHead = function (svg){
    const id = `arrow_${new Date().valueOf()}`

    let defs = ! svg.select("defs").empty() ?
        svg.select("defs") :
        svg.append("defs");

    defs.append("marker")
        .attr("id", id)
        .attr("viewBox", "0 0 10 10")
        .attr("refX","3")
        .attr("refY","3")
        .attr("markerWidth", "6")
        .attr("markerHeight", "6")
        .attr("orient", "auto-start-reverse")
        .append("path").attr("d","M 0 0 L 10 3 L 0 6 z" )
    ;

    return id;
}

JSmartObject.arrowHeadedLine = function (context, config = {
    startPoint: [0, 0],
    endPoint: [0, 0],
    plateauY: 0,
    text: "",
    fontSize: 9,
    arrowHeadId: "",
    isBgOval:true,
    roundCornerRadius: 20
}) {

    const d = config.roundCornerRadius ?
        `M ${config.startPoint[0]} ${config.startPoint[1]} v${config.plateauY - config.startPoint[1] + config.roundCornerRadius } a${config.roundCornerRadius},${config.roundCornerRadius} 0 0 1 ${config.roundCornerRadius},-${config.roundCornerRadius} h${config.endPoint[0]-config.startPoint[0] - config.roundCornerRadius * 2} a${config.roundCornerRadius},${config.roundCornerRadius} 0 0 1 ${config.roundCornerRadius},${config.roundCornerRadius} v${config.endPoint[1]-config.plateauY - config.roundCornerRadius}`
        :
        `M ${config.startPoint[0]} ${config.startPoint[1]} L ${config.startPoint[0]} ${config.plateauY} L ${config.endPoint[0]} ${config.plateauY} L ${config.endPoint[0]} ${config.endPoint[1]}`
    context.append("path")
        .attr("d", d)
        .attr("stroke", "black")
        .attr("fill", "none")
        .attr("marker-end", `url(#${config.arrowHeadId})`);

    let bg = config.isBgOval? context.append("ellipse")  : context.append("rect");

    let t = context.append("text").text(config.text).attr("font-size", config.fontSize).attr("x", (config.startPoint[0] + config.endPoint[0])/2)
        .attr("y", config.plateauY )
        .attr("dominant-baseline", "central")
        .attr("text-anchor", "middle" )
    ;

    let dimension = t.node().getBBox();

    if (config.isBgOval){
        bg
            .attr("cx", dimension.x + dimension.width / 2)
            .attr("cy", dimension.y + dimension.height / 2)
            .attr("rx", dimension.width/2 + 10)
            .attr("ry", dimension.height/2 + 3)

    }else {
        bg.attr("x", dimension.x - 5)
            .attr("y", dimension.y)
            .attr("width", dimension.width + 10)
            .attr("height", dimension.height)
            .attr("rx", Math.min(dimension.width, dimension.height) * 0.15)

    }

    bg.attr("fill", "#fff").attr("stroke", "#000")
    ;
}



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

JSmartObject.sankey = function (context, {nodes, links}, {
    format = ",", // a function or format specifier for values in titles
    align = "justify", // convenience shorthand for nodeAlign
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeLabel, // given d in (computed) nodes, text to label the associated rect
    nodeTitle = d => `${d.id}\n${format(d.value)}`, // given d in (computed) nodes, hover text
    nodeAlign = align, // Sankey node alignment strategy: left, right, justify, center
    nodeSort, // comparator function to order nodes
    nodeWidth = 15, // width of node rects
    nodePadding = 10, // vertical separation between adjacent nodes
    nodeLabelPadding = 6, // horizontal separation between node and label
    nodeStroke = "currentColor", // stroke around node rects
    nodeStrokeWidth, // width of stroke around node rects, in pixels
    nodeStrokeOpacity, // opacity of stroke around node rects
    nodeStrokeLinejoin, // line join for stroke around node rects
    linkSource = ({source}) => source, // given d in links, returns a node identifier string
    linkTarget = ({target}) => target, // given d in links, returns a node identifier string
    linkValue = ({value}) => value, // given d in links, returns the quantitative value
    linkPath = d3Sankey.sankeyLinkHorizontal(), // given d in (computed) links, returns the SVG path
    linkTitle = d => `${d.source.id} → ${d.target.id}\n${format(d.value)}`, // given d in (computed) links
    linkColor = "source-target", // source, target, source-target, or static color
    linkStrokeOpacity = 0.5, // link stroke opacity
    linkMixBlendMode = "multiply", // link blending mode
    colors = d3.schemeTableau10, // array of colors
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    marginTop = 5, // top margin, in pixels
    marginRight = 1, // right margin, in pixels
    marginBottom = 5, // bottom margin, in pixels
    marginLeft = 1, // left margin, in pixels
} = {}){
    // Convert nodeAlign from a name to a function (since d3-sankey is not part of core d3).
    if (typeof nodeAlign !== "function") nodeAlign = {
        left: d3Sankey.sankeyLeft,
        right: d3Sankey.sankeyRight,
        center: d3Sankey.sankeyCenter
    }[nodeAlign] ?? d3Sankey.sankeyJustify;

    // Compute values.
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    const LV = d3.map(links, linkValue);
    if (nodes === undefined) nodes = Array.from(d3.union(LS, LT), id => ({id}));
    const N = d3.map(nodes, nodeId).map(intern);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
    links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i], value: LV[i]}));

    // Ignore a group-based linkColor option if no groups are specified.
    if (!G && ["source", "target", "source-target"].includes(linkColor)) linkColor = "currentColor";

    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = G;

    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    // Compute the Sankey layout.
    d3Sankey.sankey()
        .nodeId(({index: i}) => N[i])
        .nodeAlign(nodeAlign)
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .nodeSort(nodeSort)
        .extent([[marginLeft, marginTop], [width - marginRight, height - marginBottom]])
        ({nodes, links});

    console.log(nodes);
    console.log(links);


    // Compute titles and labels using layout nodes, so as to access aggregate values.
    if (typeof format !== "function") format = d3.format(format);
    const Tl = nodeLabel === undefined ? N : nodeLabel == null ? null : d3.map(nodes, nodeLabel);
    const Tt = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const Lt = linkTitle == null ? null : d3.map(links, linkTitle);

    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;

    const svg = context
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const node = svg.append("g")
        .attr("stroke", nodeStroke)
        .attr("stroke-width", nodeStrokeWidth)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-linejoin", nodeStrokeLinejoin)
        .selectAll("rect")
        .data(nodes)
        .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0);

    if (G) node.attr("fill", ({index: i}) => color(G[i]));
    if (Tt) node.append("title").text(({index: i}) => Tt[i]);

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", linkStrokeOpacity)
        .selectAll("g")
        .data(links)
        .join("g")
        .style("mix-blend-mode", linkMixBlendMode);

    if (linkColor === "source-target") link.append("linearGradient")
        .attr("id", d => `${uid}-link-${d.index}`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => d.source.x1)
        .attr("x2", d => d.target.x0)
        .call(gradient => gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", ({source: {index: i}}) => color(G[i])))
        .call(gradient => gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", ({target: {index: i}}) => color(G[i])));

    link.append("path")
        .attr("d", linkPath)
        .attr("stroke", linkColor === "source-target" ? ({index: i}) => `url(#${uid}-link-${i})`
            : linkColor === "source" ? ({source: {index: i}}) => color(G[i])
                : linkColor === "target" ? ({target: {index: i}}) => color(G[i])
                    : linkColor)
        .attr("stroke-width", ({width}) => Math.max(1, width))
        .call(Lt ? path => path.append("title").text(({index: i}) => Lt[i]) : () => {});

    if (Tl) svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + nodeLabelPadding : d.x0 - nodeLabelPadding)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(({index: i}) => Tl[i]);

    function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }
}

JSmartObject.waterfall0 = function (context, data, labels, config = {
    bandWidth: 40,
    bandMargin: 5,
    colorPositive: "#393b79",
    colorNegative: "#aec7e8",
    margin: {top: 100, right: 200, bottom: 100, left: 50},
    width: 700,
    height: 500,
    numberFormat: ".2f",
    legendTopRight: "EUR Mio."
} ) {
   let data1 = data || [
       {period: "start", value: [15], isStatic: true},
       {period: "Q1", value: [-3]},
       {period: "Q2", value: [-6]},
       {period: "Q3", value: [], isStatic: true},
       {period: "Q4", value: [5]},
       {period: "Q5", value: [-2]},
       {period: "end", value: [], isStatic: true},
   ];

   const X = d3.map(data1, d=>d.period);
   const Y = d3.cumsum(data1, (d,i)=> i===0||!d.isStatic ? d3.sum(d.value):0);
   //cumsum of the array
   const YArr = data1.reduce((acc, e)=>{
       return [...acc, e.value.length?d3.zip(e.value, acc[acc.length-1]).map(x=>d3.sum(x)):acc[acc.length-1]];
   }, [data1[0].value.map(e=>0)]);

   let reductions = (ar) => {
       return ar.reduce((arr, e, i)  => {
           return i === 0? [[0, e]] : [...arr, [arr[arr.length-1][1], e+arr[arr.length-1][1]]]
       }, []).map(e=>d3.sort(e))
   }

   let stack = d3.stack().keys(labels).value((d, k) => d.value[labels.indexOf(k)])(data1).map(
       (e, i0) => {
           return e.map(
               (j, i) => i===0?[... d3.sort([j[0], j[1]]), j.data]:j.data.isStatic?reductions(YArr[i])[i0]:
               [... d3.sort([j[0]+Y[i-1], j[1]+Y[i-1]]), j.data  ]
           )
       }
   );

   let xDomain = new d3.InternSet(X);
   let yDomain = stack.flat().reduce((acc, e)=>{
        return [acc[0]>e[0]?e[0]:acc[0],acc[1]<e[1]?e[1]:acc[1]]
   }, [Infinity, -Infinity]);

   const xScale = d3.scaleBand(xDomain, [config.margin.left, config.width + config.margin.left]).paddingInner(0.2);
   const yScale = d3.scaleLinear(yDomain, [config.margin.top + config.height, config.margin.top]);

   const xAxis = d3.axisBottom().scale(xScale);
   const yAxis = d3.axisLeft().scale(yScale);

   const g = context
        .attr("width", config.width + config.margin.left + config.margin.right)
        .attr("height", config.height + config.margin.top + config.margin.bottom);

   g.append("g").attr("transform", `translate(0,${config.height + config.margin.top + 5})`).call(xAxis);
   g.append("g").attr("transform", `translate(${config.margin.left - 5},0)`).call(yAxis).call(
       g => g.selectAll(".tick line").clone()
           .attr("x2", config.width)
           .attr("stroke-opacity", 0.1)
           .attr("stroke-dasharray", "0 2 0")
   );

   g.append("g").selectAll("g").data(stack).join("g").attr("fill", (_,i)=>d3.schemeAccent[i])
       .selectAll("rect").data(D => D)
       .join("rect")
       .attr("fill", (_,i)=>(data1[i].isStatic)?"#ccc":null)
       .attr("x", (_, i)=> xScale(data1[i].period))
       .attr("y", x => yScale(x[1]))
       .attr("height", x => yScale(x[0])-yScale(x[1]))
       .attr("width", xScale.bandwidth());

   g.append("g").selectAll("text").data(stack[stack.length - 1]).join("text").text((_,i) => {
       const d = data1[i];
       if (d.isStatic) return Y[i]; //!!!!
       return ((Y[i] > Y[i-1])? "↑ ":"↓ ") + Math.abs(Y[i] - Y[i-1]);
   })
       .attr("text-anchor", "middle")
       .attr("x", (d, i) => xScale(X[i]) + xScale.bandwidth()/2)
       .attr("y", x => yScale(x[1]) - 10)
       .style("font-family", "Arial")
       .style("font-size", "10px");

   g.append("g").selectAll("line").data(stack[stack.length - 1].slice(0, -1)).join("line")
       .attr("x1", (d,i) => xScale(X[i]) + xScale.bandwidth())
       .attr("x2", (_,i) => xScale(X[i + 1]))
       .attr("y1", (d,i)=> (data1[i].isStatic && Y[i] >0) || (Y[i]>=Y[i-1] && Y[i+1] > 0)?yScale(d[1]):yScale(d[0]))
       .attr("y2", (d,i)=> (data1[i].isStatic && Y[i] >0) || (Y[i]>=Y[i-1] && Y[i+1] > 0)?yScale(d[1]):yScale(d[0]))
       .attr("stroke", "black")
       .attr("stroke-dasharray", "0 4 0");

   const startIndex = 0;
   const endIndex = 3;
   JSmartObject.arrowHeadedLine(g, {
       startPoint: [ xScale(X[startIndex]) + xScale.bandwidth()/2, yScale(stack[stack.length - 1][startIndex][1]) -25  ],
       endPoint: [ xScale(X[endIndex]) + xScale.bandwidth()/2, yScale(stack[stack.length - 1][endIndex][1]) -25  ],
       plateauY: yScale(yDomain[1])-50,
       text: `${Y[endIndex]>Y[startIndex]?"+":""}${Math.round((Y[endIndex]/Y[startIndex] - 1)*1000)/10}%`,
       fontSize: 8,
       arrowHeadId: JSmartObject.arrowHead(getSVG(g)),
       isBgOval: true,
       roundCornerRadius:5
   });

   const highlightIndex = 6
   JSmartObject.highlightBox(g, {
      y:  yScale(stack[stack.length - 1][highlightIndex][1]) -25,
       x: xScale(X[highlightIndex-1]) - 5,
       width: xScale(X[highlightIndex]) - xScale(X[highlightIndex-1]) + xScale.bandwidth() + 10,
       height: yScale(0) - yScale(stack[stack.length - 1][highlightIndex][1]) + 50
   })



}


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
    height: 500,
    numberFormat: ".2f",
    legendTopRight: "EUR Mio."
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
    var numberFormat = config.numberFormat || ".2f";
    let legendTopRight = config.legendTopRight || "EUR Mio."

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
            e["label"] =  d3.format(numberFormat)(Math.abs(e[0]["data"][e["key"]]));


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
            .text(legendTopRight);


    }, 800)
}