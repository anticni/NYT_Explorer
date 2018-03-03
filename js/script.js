const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

// parent component, gets input data(month and year) and sends it as props
    class App extends React.Component{
        
        constructor(props){

            super(props);
            this.state = {year:"",month:"", submit:false};
            this.handleSubmit = this.handleSubmit.bind(this);
        }


// submit form handler, gets input data and sets state for year and month
// sets state for submit to True, so "homescreen" is changed to child component render
        handleSubmit(event) {

            event.preventDefault();
            const year = document.getElementById("yearpick").value;
            const month = document.getElementById("monthpick").value;
            this.setState({year:year, month:month, submit:true});
        }


        render(){

            let yearselect = [];
                for (var i = 2018; i > 1850; i--) {
                    yearselect.push(<option key={i} value={i}>{i}</option>);
                }
            let form = <form onSubmit={this.handleSubmit}>
                              <select defaultValue={this.state.month} name="month" id="monthpick" className="datepicker">
                                  <option style={{display:'none'}} value="">Month</option>
                                  {monthNames.map((month,index) => 
                                   <option key={index} value={index+1}>{month}</option>)}
                              </select>
                              <select defaultValue={this.state.year} name="year" id="yearpick" className="datepicker">
                                <option style={{display:'none'}} value="">Year</option>
                                {yearselect}
                              </select>
                         <input type="submit" className="datepicker" value="Find" />
                         </form>;

            if (this.state.submit) {
                return <Data year={this.state.year} month={this.state.month} searchbox={form} />;

            }                         
                return (<div className="home">
                            <div className="searchbox start">
                            {form}
                            </div>
                           <p>Enter a Date to search articles</p>
                        </div>);
               
            }
        }

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
                            <footer><a href="http://developer.nytimes.com">
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


// simple component that only maps the child components(the cards/livepreview results)
    class Article extends React.Component{
            
        constructor(props){

          super(props);

        }

        render(){

           let link = this.props.article;
           let details = this.props.detail;
           console.log(link);
           
            

                return <div className="cards" id="cards">{link.map((link,index) => 
                        <Linkpreview count={index} link={link} key={index} details={details[index]} />)} 
                       </div>;  
                
            
           
        }

    }


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
                                <p>{this.props.link.description}</p>
                                <a href={this.props.link.url}>Link</a>
                                    <p style={{'textAlign':'center'}} className="caret">&#9660;</p>
                                <pre id={this.props.count}  style={{display:'none'}}>{JSON.stringify(this.props.details, undefined, 2)}</pre>
                            </div>
                    </div>);
        }

    }


        




    const root = document.getElementById('root');
    
    ReactDOM.render(<App />, root);

