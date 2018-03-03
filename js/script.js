const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
// for (var i = 1; i<=12; i++){
//     $('#monthpick').append($('<option />').val(i).html(monthNames[i-1]));
// }
// for (var i = new Date().getFullYear(); i > 1850; i--){
//     $('#yearpick').append($('<option />').val(i).html(i));
// }


    class First extends React.Component{
        
        constructor(props){

            super(props);
            this.state = {year:"",month:"", submit:false};
            this.handleDate = this.handleDate.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }


        handleDate(event){
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;

            this.setState({[name]: value});
        }

        handleSubmit(event) {
            event.preventDefault();
            this.setState({submit:true});
            console.log(this.state);
        }

        render(){
            let yearselect = [];
                for (var i = 2018; i > 1850; i--) {
                    yearselect.push(<option key={i} value={i}>{i}</option>);
                }
            let form = <form onSubmit={this.handleSubmit}>
                              <select value={this.state.month} name="month" id="monthpick" className="datepicker" onChange={this.handleDate}>
                                  <option style={{display:'none'}} value="">Month</option>
                                  {monthNames.map((month,index) => 
                                   <option key={index} value={index+1}>{month}</option>)}
                              </select>
                              <select value={this.state.year} name="year" id="yearpick" className="datepicker" onChange={this.handleDate}>
                                <option style={{display:'none'}} value="">Year</option>
                                {yearselect}
                              </select>
                         <input type="submit" className="findbtn" value="Find" />
                         </form> ;
            if (!this.state.submit) {
                return (<div>
                            {form}
                            Enter a Date
                        </div>);
            }                         
                return (<div>
                            <div className="searchbox">
                            {form}
                            </div>
                            <App year={this.state.year} month={this.state.month} />
                        </div>);
               
            }
        }

    class App extends React.Component {

        constructor(props){

          super(props);
          this.state = {'docs': [], 'preview':[],'detail':[],'page':0,'lastpage':false};
          this.getArchive = this.getArchive.bind(this);
          this.getPreview = this.getPreview.bind(this);
          this.handlePage = this.handlePage.bind(this);
          this.getPage = this.getPage.bind(this);
          this.ajax = this.ajax.bind(this);
        }

        componentDidMount(){
            this.ajax();
        }
        componentWillReceiveProps(){
            this.ajax();
        }
        ajax(){
            const month = this.props.month;
            const year = this.props.year;
            const date = year + "/" + month;
            if (month ==""||year=="") {
                return this.setState({docs:['0']})
            }
          $.ajax({
              type: "GET",
              data: {
                  "api-key": "577c6c7abfb04fef9d593d84decf7d8e"
              },
              url: "https://api.nytimes.com/svc/archive/v1/"+date+".json",
              success: this.getArchive
          })    
        }

        getArchive(data) {

          let docs = [];
          for(var i = 0; i < data.response.docs.length; i++) {
            const doc = data.response.docs[i];
            docs.push(doc);

          }
          this.setState({'docs': docs,preview:[]});
          console.log(this.state.docs);
          this.getPage();
       
        }

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
            // data: {
            //     "key": "5a8ebb935fe6d61d084d8e03e1012a86b3635549fe59d",
            //     "q": doc.web_url
            // },
            url: "https://api.linkpreview.net/?key=123456&q=https://www.google.com",
            success: this.getPreview
            })

            }
            this.setState({'detail':detailArr});
        }

        getPreview(data){

            var p = this.state.preview;
            p.push(data);
            this.setState({preview: p});
            console.log(this.state.preview);
        }




        handlePage(event) {
        document.getElementById('cards').className = 'cards';
        let pageVal = Number(event.currentTarget.value);
        document.getElementById('detailFloat').textContent = "";
        console.log(pageVal);
        this.setState({page:pageVal,preview:[],detail:[],lastpage:false});
        
        this.getPage(pageVal);

        
    }



        
        render() {
            var pagecount = []
            for (var i = 1; i <= Math.ceil(this.state.docs.length/20); i++) {

                        pagecount.push(<option key={i-1} value={(i-1)*20}>{i}</option>)
                }

            if (this.state.docs[0]==0) {
                return <div className="nodate">No articles to be shown<br/>Please check if you selected a date.</div>
            }
            if (this.state.preview.length >= 20 || this.state.lastpage == undefined) {
                return   <div className="root-wrapper">
                             <div className="inline">
                             <Url article={this.state.preview} docs={this.state.docs} detail={this.state.detail} />
                             <pre className="detailFloat" id="detailFloat"></pre>
                             </div>
                         <div className="selectpage" id="selectpage">Page:
                                <select className="selectbtn" value={this.state.page} onChange={this.handlePage}>
                                {pagecount}
                                </select>
                        </div>

                         </div>;     
                
            }
            return <div> loading</div>
        }    
    }


    class Url extends React.Component{
            
        constructor(props){

          super(props);

        }
        componentDidUpdate(){
            // $("#selectpage").appendTo("#root");
            
        }
        render(){
           let link = this.props.article;
           let details = this.props.detail;
           // console.log(details);
           console.log(link);
           
            

                return <div className="cards" id="cards">{link.map((link,index) => 
                        <Linkpreview count={index} link={link} key={index} details={details[index]} />)}
                        
                       </div>;  
                
            
           
        }

    }



    class Linkpreview extends React.Component{
        constructor(props){

            super(props);
            this.HandleClick = this.HandleClick.bind(this);
            this.HandleBookmark = this.HandleBookmark.bind(this);
        }

        HandleClick(props){
            document.getElementById(this.props.count).classList.toggle('showhide');
            document.getElementById('cards').className = 'cards clicked';
            let detailFloat = document.getElementById('detailFloat');
            var original = document.getElementById(this.props.count).textContent;
            detailFloat.textContent = "";
            detailFloat.textContent = original;
            
            console.log('hello');
        }

        HandleBookmark(props){
            let url = encodeURIComponent(this.props.link.url);
            let title = encodeURIComponent(this.props.link.title);

            window.open("https://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk="+url+"&title="+title);

        }

        render(){

            // console.log(this.props.details);
        // console.log(this.props.details)
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
    
    ReactDOM.render(<First />, root);

