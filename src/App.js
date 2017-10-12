import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import CircleRow from './CircleRow';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			feeds: [ "" ],
			clicks: 0,
			request: 0,
			timeoutID: 0,
			articles: [ "" ]
		}
	}
	
	componentWillMount()
	{
		this.checkFeeds();
	}

	componentDidMount()
	{
		this.setTimePassed();
	}
	
	componentWillUnmount() 
	{
		setTimeout( () => { } ); 
	}
	
	checkFeeds() 
	{
		const apiKey = "&apiKey=57a875aad7494aed9f0902f28ff4c51e";
		
		const arsUrl      = "https://newsapi.org/v1/articles?source=ars-technica&sortBy=latest"     + apiKey;
		const cnnUrl      = "https://newsapi.org/v1/articles?source=cnn&sortBy=top"                 + apiKey;
		const googleUrl   = "https://newsapi.org/v1/articles?source=google-news&sortBy=top"         + apiKey;
		const engadgetUrl = "https://newsapi.org/v1/articles?source=engadget&sortBy=top"            + apiKey;
		const nytUrl      = "https://newsapi.org/v1/articles?source=the-new-york-times&sortBy=top"  + apiKey;
		const newSciUrl   = "https://newsapi.org/v1/articles?source=new-scientist&sortBy=top"       + apiKey;
		const washPostUrl = "https://newsapi.org/v1/articles?source=the-washington-post&sortBy=top" + apiKey;
		const timeMagUrl  = "https://newsapi.org/v1/articles?source=time&sortBy=latest"             + apiKey;
		
		let feeds = [ arsUrl, cnnUrl, googleUrl, engadgetUrl, nytUrl, washPostUrl, newSciUrl, timeMagUrl ];

		this.setState({ feeds: feeds, articles: []  });		
		
		this.getArticlesInFeeds(feeds, 10);
		
		setTimeout( () => { this.checkFeeds(); }, 60000); 
	}
	
	getArticlesInFeeds(feeds, max)
	{
		if ((feeds == null) || (feeds.length < 1)) return;
		
		let url = feeds[0];
		
		feeds = feeds.splice(1);
		
		axios.get(url).then(res => {
	
			var articles		 = this.state.articles;
			
			if ((res.data != null) && (res.data.articles != null))
			{	
				for (var i = 0; (i < res.data.articles.length) && (i < max); ++i)
				{
					articles.push(new this.article(res.data.articles[i].description, res.data.articles[i].url, res.data.articles[i].urlToImage));
				}
			
				this.setState({ articles: articles });
				this.getArticlesInFeeds(feeds, max);
			}
		});
	}

	article(description, url, imageUrl) {
    this.description = description;
    this.url         = url;
    this.imageUrl    = imageUrl;
	}
	
	setTimePassed() 
	{
		this.setState({ clicks:(this.state.clicks+1)})
		setTimeout( () => { this.setTimePassed(); }, 40); 
	}
	
  update (e )
	{
		this.setState({ clicks:(this.state.clicks+1)})
	}
		
	render() {
		let circleRows = [];
		const rows = this.props.totalRows;
		
		for (var i = 0; i < rows; ++i)
		{
			circleRows.push(<div key={i}><CircleRow rownum={i} rows={rows} articles={this.state.articles} tick={this.state.clicks + i*8}/><br /></div>);
		}

		return <div>{circleRows}</div>
	}
}

App.propTypes = {
	totalRows: PropTypes.number
}

export default App