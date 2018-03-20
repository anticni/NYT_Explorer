import React from 'react';

// component for displaying livepreview results
    class Linkpreview extends React.Component{
        constructor(props){

            super(props);
            this.HandleClick = this.HandleClick.bind(this);
            this.HandleBookmark = this.HandleBookmark.bind(this);
        }

        // click handler for displaying details 
        HandleClick(props){
            // toggling showhide class for mobile view details
            document.getElementById(this.props.count).classList.toggle('showhide');

            // adding a clicked class to cards div, for master/detail view on desktops.
            document.getElementById('cards').className = 'cards clicked';

            // getting the detailFloat placeholder and adding clicked text content to it.
            let detailFloat = document.getElementById('detailFloat');
            var detail = document.getElementById(this.props.count).textContent;
            detailFloat.textContent = "";
            detailFloat.textContent = detail;
            
            console.log('clicked on a card!');
        }

        // bookmark handling, uses google bookmarks(popup window/tab for adding the selected article to bookmarks)
        HandleBookmark(props){

            let url = encodeURIComponent(this.props.link.url);
            let title = encodeURIComponent(this.props.link.title);

            window.open("https://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk="+url+"&title="+title);

        }

        render(){

            return (<div className="card" onClick={this.HandleClick}>
                        <header>
                            <h2>{this.props.link.title}<a className="bookmark-star" onClick={this.HandleBookmark}>&#9733;</a></h2>
                        </header>
                        <img src={this.props.link.image}></img>
                            <div className="body">
                                <p className="description">{this.props.link.description}</p>
                                <a href={this.props.link.url} target="_blank">Link</a>
                                    <p style={{'textAlign':'center'}} className="caret">&#9660;</p>
                                <pre id={this.props.count}  style={{display:'none'}}>{JSON.stringify(this.props.details, undefined, 2)}</pre>
                            </div>
                    </div>);
        }

    }

export default Linkpreview;