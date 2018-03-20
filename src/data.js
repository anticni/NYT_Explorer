import React from 'react';
import $ from 'jquery';
import Article from './article.js';
// component for fetching pretty much all the needed data, it does the archiveAPI ajax call with props from parent, then sends that data
// to the linkpreviewAPI ajax call, so link previews can be set as state and sent to a child.
    class Data extends React.Component {

        constructor(props){

          super(props);
          this.state = {'docs': [], 'preview':[],'detail':[],'page':0,'lastpage':false, 'error':false};
          this.getArchive = this.getArchive.bind(this);
          this.getPreview = this.getPreview.bind(this);
          this.handlePage = this.handlePage.bind(this);
          this.getPage = this.getPage.bind(this);
          this.getDocs = this.getDocs.bind(this);
          this.handleAjaxError = this.handleAjaxError.bind(this);
        }

        componentDidMount(){

            this.getDocs();
        }
        componentWillReceiveProps(){

            this.getDocs();
        }
        
        // first AJAX call method, called on mount, AND every time the child receives new props(month and year)
            getDocs(){

                const month = this.props.month;
                const year = this.props.year;
                const date = year + "/" + month;
                  $.ajax({
                      type: "GET",
                      data: {
                          "api-key": "577c6c7abfb04fef9d593d84decf7d8e"
                      },
                      url: "https://api.nytimes.com/svc/archive/v1/"+date+".json",
                      success: this.getArchive,
                      error: this.handleAjaxError
                  })    
            }
    
        // if archiveAPI AJAX call is successful, getArchive method extracts the articles/documents from the response and calls the getPage method.
            getArchive(data) {

                let docs = [];
                    for(var i = 0; i < data.response.docs.length; i++) {
                        const doc = data.response.docs[i];
                         docs.push(doc);
                     }
                this.setState({'docs': docs, 'preview':[], 'error':false});
      
                this.getPage();
            
            }

        // next method that extracts the needed amount of docs for the selected page(initial page is 0)
        // and does the linkpreviewAPI AJAX call, which if successful, will go to getPreview method
        getPage(page = 0){
            
            var detailArr = []
                for (var i = page; i < page+20; i++) {
                    const doc = this.state.docs[i];
                    console.log(detailArr)
                    if (doc == undefined) { 
                        this.setState({lastpage:true});
                        break; 
                    }
                detailArr.push(doc);

            
                $.ajax({
                type: "GET",
                data: {
                    "key": "5a8ebb935fe6d61d084d8e03e1012a86b3635549fe59d",
                    "q": doc.web_url
                },
                url: "https://api.linkpreview.net/",
                success: this.getPreview,
                error: this.handleAjaxError
                });
            this.setState({'detail':detailArr});
            }
        }

        // method for adding linkprevew data for the selected page
        getPreview(data){

            var p = this.state.preview;
            p.push(data);
            this.setState({'preview': p,'error':false});
        }



        // page handler(onchange)
        handlePage(event) {
            // returning any changed text and classes to original values
            document.getElementById('cards').className = 'cards';
            document.getElementById('detailFloat').textContent = "";

            // get page value from event
                let pageVal = Number(event.currentTarget.value);
            console.log(pageVal);
            // set state for page and reset state for other
                this.setState({page:pageVal,preview:[],detail:[],lastpage:false});
            // call getPage method, so it can fetch all the data for selected page
                this.getPage(pageVal);
        }

        // method for handling ajax errors, only changes state for error to True, which will cause the conditional rendering
        // to render an error page
        handleAjaxError(jqXHR, textStatus, errorThrown) {

            this.setState({'error':true});
            console.log('failed!');

        }



        
        render() {

            // page count loop, gets number of pages based on length of docs array(which contains all the articles)
            let pagecount = []
            for (var i = 1; i <= Math.ceil(this.state.docs.length/20); i++) {

                        pagecount.push(<option key={i-1} value={(i-1)*20}>{i}</option>)
                }

                // condition for displaying error page
            if (this.state.error) {
                return <div className="error">
                        {this.props.searchbox}
                            <p>Something went wrong...</p>
                            <p>Please try again.</p>
                            <p><small>Check if you entered a valid date!</small></p>
                       </div>;
            }
                // conditions for displaying results page
            if (this.state.preview.length >= 20 || (this.state.lastpage == true && this.state.page!=0) ) {
                return <div className="root-wrapper">
                        {this.props.searchbox}
                            <div className="inline">
                                <Article article={this.state.preview} docs={this.state.docs} detail={this.state.detail} />
                                    <pre className="detailFloat" id="detailFloat"></pre>
                            </div>
                         <div className="selectpage" id="selectpage">Page:
                            <select className="selectbtn" value={this.state.page} onChange={this.handlePage}>
                                {pagecount}
                            </select>
                         </div>
                            <footer><a href="http://developer.nytimes.com" target="_blank">
                                <img src="https://static01.nytimes.com/packages/images/developer/logos/poweredby_nytimes_150b.png" alt="NYTimes API" />
                              </a>
                              <a href="https://www.google.com/bookmarks/" target="_blank">
                                         <img src="img/googlebookmarks.png" alt="Google bookmarks" height="70px" />
                                    </a>
                            </footer> 
                       </div>;     
                
            }
            // if no conditions are met, a loading screen is shown
            return <div> 
                    <div className="spinner">
                        <div className="dot1"></div>
                        <div className="dot2"></div>
                    </div>
                   </div>
        }    
    }

export default Data;