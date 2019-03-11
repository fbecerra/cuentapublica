var margin = {top: 20, right: 10, bottom: 40, left: 10};

var width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

var x = d3.scaleBand().range([0, width/2]).padding(0.1);
    y = d3.scaleLinear().range([height/14, 0]);

d3.json('data/data.json').then(function(data){
  console.log(data);

  terms = ['sistema', 'política', 'recursos', 'educación', 'calidad', 'reforma',
           'salud', 'familias', 'chilenos', 'programa', 'proyecto', 'derechos']
  x.domain(data.years);
  var yScales = terms.map(d => d3.scaleLinear().range([height/14, 0]).domain([0, d3.max(data.terms[d])]));

  // TERMS
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var gTerms = g.selectAll(".term")
    .data(terms)
    .enter().append("g")
    .attr("class", "term")
    .attr("transform", (d, i) => "translate(" + 0 + "," + (i * height/12) + ")");

  gTerms.selectAll("text")
    .data(d => [d])
    .enter().append('text')
    .text(d => "" + d + " ")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("transform", "translate(0,20)");

  gTerms.selectAll(".bar")
      .data((d,i) => data.terms[terms[0]].map(function(e,j){
        return {'year': data.years[j], 'count': e, 'index': i};
      }))
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.year))
      .attr("width", x.bandwidth())
      .attr("y", d => yScales[d.index](d.count))
      .attr("height", d => height/14 - yScales[d.index](d.count))
      .attr("transform", "translate(200,0)")
      .attr("fill", function(d){
        let idx = data.presidents.findIndex(function(e){
          return e.year_start <= d.year & d.year <= e.year_end
        });
        return idx % 2 == 0 ? '#377eb8' : '#e41a1c'
      })


  // add the x Axis
  // gTerms.append("g")
  //     .attr("transform", (d, i) => "translate(" + 0 + "," + (i * height/12) + ")")
  //     .call(d3.axisBottom(x).ticks(4));

  // add the y Axis
  // gTerms.append("g")
  //     .call(d => d3.axisLeft(yScales[d.index]));

  // // CONTEXT
  // var context = svgBook.append("g")
  //   .attr("class", "group-context")
  //   .attr("transform", "translate(" + (margin.left + termsWidth) + "," + (margin.top + headerHeight) + ")")
  //
  // // ACTIONS
  // var actions = svgBook.append("g")
  //   .attr("class", "group-actions")
  //   .attr("transform", "translate(" + (margin.left + termsWidth + contextWidth) + "," + (margin.top + headerHeight) + ")")
  //
  // // TOP CHARACTERS
  // var characters = data.entities;
  //
  // var entities = svgBook.append("g")
  //   .attr("transform", "translate(" + margin.left + "," + (margin.top + headerHeight) + ")");
  //
  // entities.append("g")
  //   .attr("class", "terms-title")
  //   .append("text")
  //   .html('Top '+maxCharacters+
  //         ' <a class="select" onclick="sayHello()">characters</a> by'+
  //         ' <a class="select" onclick="sayHello()">count</a>')
  //   .attr("font-family", "sans-serif")
  //   .attr("font-size", "14px")
  //
  // var gEntities = entities.selectAll(".character")
  //   .data(characters.slice(0, maxCharacters))
  //   .enter().append("g")
  //   .attr("class", d => "word "+getClass(d[0]))
  //   .attr("transform", (d, i) => "translate(" + (i % charactersPerLine * 80) + "," + (Math.floor(i / charactersPerLine) * 20 + 20) + ")")
  //
  // gEntities.append("text")
  //   .html(d => d[0]+" <a class='count'>"+d[1]+"</a>")
  //   .attr("font-family", "sans-serif")
  //   .attr("font-size", "12px")
  //   .on("mouseover", function(d){
  //     d3.select(this).style('fill', 'steelblue')
  //
  //     gPlot.selectAll("."+getClass(d[0]))
  //       .attr("stroke", "steelblue")
  //       .attr("opacity", 1.0)
  //   })
  //   .on("mouseleave", function(d){
  //     d3.select(this).style('fill', 'black')
  //
  //     gPlot.selectAll("."+getClass(d[0]))
  //       .attr("stroke", "lightgray")
  //       .attr("opacity", lineOpacity)
  //   })
  //   .on("click", function(d){
  //
  //     // Update linear gradients
  //     var gradients = defs.selectAll("linearGradient")
  //         .data(d[2])
  //
  //     var allGradients = gradients.enter().append("linearGradient")
  //       .merge(gradients)
  //       .attr("id", (s,i) => "linear-gradient-"+s)
  //
  //     gradients.exit().remove()
  //
  //     var stops = allGradients.selectAll("stop")
  //       .data(function(e){
  //         var idx_start = data.sentences[e].indexOf(d[0]);
  //
  //         var dummy_text = svgBook.append("text")
  //                 .attr("font-family", "sans-serif")
  //                 .attr("font-size", "14px")
  //                 .html(data.sentences[e])
  //         var sentWidth = dummy_text.node().getComputedTextLength()
  //         dummy_text.remove()
  //
  //         dummy_text = svgBook.append("text")
  //                 .attr("font-family", "sans-serif")
  //                 .attr("font-size", "14px")
  //                 .html(data.sentences[e].slice(0, idx_start))
  //
  //         var x_offset = dummy_text.node().getComputedTextLength()
  //         dummy_text.remove()
  //
  //         dummy_text = svgBook.append("text")
  //                 .attr("font-family", "sans-serif")
  //                 .attr("font-size", "14px")
  //                 .html(d[0])
  //         x_offset += dummy_text.node().getComputedTextLength()/2
  //         dummy_text.remove()
  //
  //         var x0 = -(contextWidth/2-x_offset)/sentWidth*100,
  //             x1 = (x_offset/sentWidth*100),
  //             x2 = (contextWidth/2+x_offset)/sentWidth*100;
  //
  //         return [x0+"%", (x0+5)+"%", x1+'%', (x2-5)+"%", x2+'%']
  //       })
  //
  //     stops.enter().append("stop")
  //       .merge(stops)
  //       .attr("offset", d => d)
  //       .attr("stop-opacity", function(s, i){
  //         switch (i) {
  //           case 0:
  //             return 0;
  //           case 4:
  //             return 0;
  //           default:
  //             return 1;
  //         }
  //       })
  //       .attr("stop-color", "black")
  //
  //     // Update context
  //     var t = d3.transition()
  //       .duration(750);
  //
  //     gEntities.selectAll("text").style('fill', 'black')
  //
  //     d3.select(this).style('fill', 'steelblue')
  //
  //     // var chapterContext = context.selectAll("g")
  //     //     .data(data.headings)
  //     //
  //     // var allContexts = chapterContext.enter().append("g")
  //     //   .attr("transform", (e, i) => "translate(0 ," + (i * 20) + ")")
  //     //   .merge(gradients)
  //     //
  //     // allContexts.append("text")
  //     //   .html(d => data.paragraphs[d[0]])
  //     //   .attr("font-family", "sans-serif")
  //     //   .attr("font-size", "14px")
  //     //
  //     // allContexts.exit().remove()
  //     //
  //     // var sentences = allContexts.selectAll("g")
  //     //   .data(function(d){
  //     //     console.log(d)
  //     //     filteredSents = data.sentences.filter(function(e, i){
  //     //       return (d[1] <= i && i < d[2])
  //     //     })
  //     //     return filteredSents;
  //     //   })
  //     //
  //     // sentences.enter().append("g")
  //     //   .attr("class", function(d){ console.log(d)})
  //
  //
  //     var sentences = context.selectAll("g")
  //       .data(d[2])
  //
  //     // Update old
  //     var text = sentences.select("text")
  //
  //     // Create new entries
  //     sentences.enter().append("g")
  //       .attr("transform", (e, i) => "translate(0 ," + (i * 20) + ")")
  //       .append("text")
  //       .merge(text)
  //       .attr("class", "context")
  //       .html(s => data.sentences[s])
  //       .attr("font-family", "sans-serif")
  //       .attr("font-size", "14px")
  //       .style("fill", (e, i) => "url(#linear-gradient-"+e+")")
  //       .attr("transform", function(s){
  //           var idx_start = data.sentences[s].indexOf(d[0]);
  //           var dummy_text = svgBook.append("text")
  //                   .attr("font-family", "sans-serif")
  //                   .attr("font-size", "14px")
  //                   .html(data.sentences[s].slice(0, idx_start))
  //
  //           var x_offset = dummy_text.node().getComputedTextLength()
  //           dummy_text.remove()
  //
  //           dummy_text = svgBook.append("text")
  //                   .attr("font-family", "sans-serif")
  //                   .attr("font-size", "14px")
  //                   .html(d[0])
  //           x_offset += dummy_text.node().getComputedTextLength()/2
  //           dummy_text.remove()
  //
  //           return "translate("+(contextWidth/2-x_offset)+",0)"
  //       });
  //
  //     // Remove old
  //     sentences.exit().remove();
  //
  //     // ACTIONS
  //     var verbs = actions.selectAll("g")
  //       .data(d[3].sort((a,b) => b[1].length - a[1].length))
  //
  //     // Update old
  //     var verbsText = verbs.select("text")
  //
  //     // Create new entries
  //     verbs.enter().append("g")
  //       .attr("transform", (e, i) => "translate(0 ," + (i * 20) + ")")
  //       .append("text")
  //       .merge(verbsText)
  //       .attr("class", "context")
  //       .html(s => s[0]+" <a class='count'>"+s[1].length+"</a>")
  //       .attr("font-family", "sans-serif")
  //       .attr("font-size", "14px")
  //
  //     // Remove old
  //     verbs.exit().remove();
  //
  //   })
  //
  // // SEARCH BAR
  //
  // // PLOT
  //
  // var x = d3.scaleBand()
  //   .rangeRound([0, plotWidth])
  //   .padding(0.1);
  //
  // var y = d3.scaleLinear()
  //   .rangeRound([plotHeight, 0]);
  //
  // var gPlot = svgBook.append("g")
  //   .attr("transform", "translate(" + (margin.left*2) + "," + (margin.top + headerHeight + termsHeight) + ")");
  //
  // var headings = data.headings.map(d => data.paragraphs[d[0]])
  // console.log(headings)
  //
  // var line = d3.line()
  //   .curve(d3.curveMonotoneX)
  //   .x(function(d, i) { return x(headings[i]); })
  //   .y(function(d, i) { return y(d); });
  //
  // x.domain(headings);
  // y.domain([d3.min(data.entities, d => d3.min(d[4])),
  //           d3.max(data.entities, d => d3.max(d[4]))]);
  //
  // gPlot.append("g")
  //   .attr("transform", "translate(0," + (plotHeight/2 + headerHeight + termsHeight) + ")")
  //   .call(d3.axisBottom(x))
  //   .select(".domain")
  //   .remove();
  //
  // gPlot.append("g")
  //   .call(d3.axisLeft(y))
  //   .append("text")
  //   .attr("fill", "#000")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 6)
  //   .attr("dy", "0.71em")
  //   .attr("text-anchor", "end")
  //   .text("Relevance");
  //
  // data.entities.forEach(function(d){
  //   gPlot.append("path")
  //     .datum(d[4])
  //     .attr("class", "line "+getClass(d[0]))
  //     .attr("fill", "none")
  //     .attr("stroke", "lightgray")
  //     .attr("opacity", lineOpacity)
  //     .attr("stroke-linejoin", "round")
  //     .attr("stroke-linecap", "round")
  //     .attr("stroke-width", 1.5)
  //     .attr("d", line)
  //     .on("mouseover", function(e){
  //       d3.select(this)
  //         .attr("stroke", "steelblue")
  //         .attr("opacity", 1.0)
  //
  //       gEntities.selectAll("."+getClass(d[0])+" text")
  //         .style("fill", "steelblue")
  //     })
  //     .on("mouseleave", function(e){
  //       d3.select(this)
  //         .attr("stroke", "lightgray")
  //         .attr("opacity", lineOpacity)
  //
  //       gEntities.selectAll("."+getClass(d[0])+" text")
  //         .style("fill", "black")
  //     });
  //   }
  // )
});
