import React from 'react';
import PropTypes from 'prop-types';

class CircleRow extends React.Component {
	
	updateColors()
	{
		let index = 3 * this.props.tick;
			
		while ((index < 0) || (index > 255))
		{ 
		  if (index < 0) index = -index;
		  if (index > 255) index = 255 - (index - 255);
		}
		
		this.state = { 	index:				index,
										rownum:     	this.props.rownum,
										rows:       	this.props.rows,
										articles:			this.props.articles
									}
	}
	
	render() 
	{
		this.updateColors();

		let totalRows = (this.state.rows == null) ? 0 : this.state.rows;		
		let spacing   = 10;
		let rowWidth  = (window.innerWidth  - spacing*6);
		let rowHeight = (window.innerHeight - spacing*6)/totalRows;
		let maxRadius = (rowHeight - spacing)/2;
		
		let widthStr  = "" + rowWidth + "px";
		let heightStr = "" + rowHeight + "px";
		let dimStr    = "0 0 " + rowWidth + " " + rowHeight;
		
		let circlesInRow = Math.round(rowWidth/(2*maxRadius + spacing));
		
		while ((circlesInRow * (maxRadius*2 + spacing)) > rowWidth) --circlesInRow;

		circlesInRow++;
		
		let opacity = this.props.tick/500;
		
		while ((opacity < 0) || (opacity > 1.0))
		{ 
		  if (opacity < 0) opacity = -opacity;
		  if (opacity > 1.0) opacity = 1.0 - (opacity - 1.0);
		}
		
		let circleRows = [];
		
		let span = maxRadius + spacing;
		
		let totalArticles = (this.state.articles != null) ? this.state.articles.length : 0;
		let totalCircles  = (this.state.rows == null) ? circlesInRow : this.state.rows*circlesInRow;		
		
		for (let loop = 0; loop < circlesInRow; ++loop)
		{
			let r  = (this.state.index/256)*maxRadius;
			let cx = maxRadius*2*opacity + (2*maxRadius + spacing)*loop;
			let cy = rowHeight/2;
			let ux = cx - 0.7*r;
			let uy = cy - 0.7*r;
			
			let row = (this.state.rownum == null) ? 0 : this.state.rownum;
			
			let circleIndex = ((row * circlesInRow) + loop);
			let articleIndex = (totalArticles === 0) ? 0 : ((row * circlesInRow) + loop);
			
			while ((totalArticles > 0) && (totalArticles <= articleIndex)) articleIndex -= totalArticles;
			
			let circleFrac = circleIndex/totalCircles;

			if (circleFrac < 0) circleFrac = 0;
			if (circleFrac > 1) circleFrac = 1;
			
			let redFrac = (circleFrac > 0.5) ? 1 : 2*circleFrac;
			let redVal  = (1 - redFrac);
			
			let blueFrac = (circleFrac < 0.5) ? 0 : 2*(circleFrac-0.5);
			let blueVal  = blueFrac;

			let greenFrac = 1 - Math.abs(circleFrac*2 - 1);
			let greenVal  = greenFrac;
			
			let maxVal = Math.max(redVal, greenVal, blueVal);
			let mult   = (maxVal <= 0) ? 1.0 : 1/maxVal;
			
			let red   = Math.round(mult * redVal    * 255);
			let blue  = Math.round(mult * blueVal   * 255);
			let green = Math.round(mult * greenFrac * 255);

			let fillColor   = "rgb("+red+","+green+","+blue+")";
			let strokeColor = "rgb("+(255-red)+","+(255-green)+","+(255-blue)+")";
			
			let image  = (totalArticles > 0) ? this.state.articles[articleIndex].imageUrl 	 : "";
			let url    = (totalArticles > 0) ? this.state.articles[articleIndex].url 				 : "";
			let descr  = (totalArticles > 0) ? this.state.articles[articleIndex].description : "";
			
			let maxDescrLen = Math.round(maxRadius*0.35);
			
			let commonCircleValues = { strokeWidth:"2" };
			let commonTextValues = { textAnchor: "middle", fontSize:"12", fontFamily:"Arial", fill:"black" };
			let fontSize = 12;
			let textRows = [];

			let textLine = 0;
			let maxLines = (maxRadius*2)/(fontSize + 2) - 1;
			
			if (descr === null) descr = "";
			
			while ((textLine < maxLines) && (descr.length > 0))
			{
				let cutPoint = maxDescrLen;
				while ((descr.charAt(cutPoint) !== " ") && (cutPoint > 0))
				{
					--cutPoint;
				}

				var articlePiece = (cutPoint < 1) ? "" : descr.substring(0, cutPoint);

				descr = (descr.length > cutPoint) ? descr.substring(cutPoint) : "";
				
				textRows.push(<text opacity={1-opacity/2}  x={cx}  y={cy-maxRadius+(fontSize+2)*(textLine + 1)} r={r} {...commonTextValues} >{articlePiece}</text>)
				
				++textLine;
			}
			
			circleRows.push(<g key={loop}>
												<image  opacity={1-opacity/2}  x={ux}  y={uy}           height={1.4*r} width={1.4*r} href={image} />
												{textRows}
												<circle opacity={  opacity  } cx={cx} cy={cy}           r={r} stroke={strokeColor} fill={fillColor} {...commonCircleValues} />
												<a href={url} target="_blank" >
													<rect opacity={0.0} x={cx-span} y={cy-span} height={2*span} width={2*span} fill="white" />
												</a>
											</g>);
		}
					   
		return	<svg viewBox={dimStr} xmlns="http://www.w3.org/2000/svg" width={widthStr} height={heightStr} >{circleRows}</svg>
	}
}

CircleRow.propTypes = {
	tick: 				PropTypes.number,
	rownum:				PropTypes.number,
	rows:					PropTypes.number,
	articles:			PropTypes.array
}

export default CircleRow