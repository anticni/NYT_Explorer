function find() {
    // body...
    let month = $('#month').val();
    let year = $('#year').val();

    

    class App extends React.Component {

        constructor(props){

          super(props);
          this.state = {'docs': [], 'preview':[], 'page':0};
          this.getArchive = this.getArchive.bind(this);
          this.getPreview = this.getPreview.bind(this);
          this.handlePage = this.handlePage.bind(this);
          this.getPage = this.getPage.bind(this);
        }

        getArchive(data) {
            debugger;
          let docs = [];
          for(var i = 0; i < data.response.docs.length; i++) {
            const doc = data.response.docs[i];
            docs.push(doc);

          }
          this.setState({'docs': docs});
          console.log(this.state.docs);
          this.getPage();
       
        }

        getPreview(data){
    
            var p = this.state.preview;
            p.push(data);
            this.setState({preview: p});
        }

        getPage(){
            for (var i = this.state.page; i < 20; i++) {
                const doc = this.state.docs[i].web_url;
            
            $.ajax({
            type: "GET",
            // data: {
            //     "key": "5a8ebb935fe6d61d084d8e03e1012a86b3635549fe59d",
            //     "q": doc.web_url
            // },
            url: "http://api.linkpreview.net/?key=123456&q=https://www.google.com",
            success: this.getPreview
          })

            }
            
        }


        handlePage(event) {
        let pageVal = event.currentTarget.value
        console.log(pageVal);
        this.setState({'page': pageVal});
        this.setState({preview:[]});
        console.log(this.state.page);
        this.getPage();
        debugger;
    }

        componentDidMount(){

          $.ajax({
              type: "GET",
              data: {
                  "api-key": "577c6c7abfb04fef9d593d84decf7d8e"
              },
              url: "https://api.nytimes.com/svc/archive/v1/2016/1.json",
              success: this.getArchive
          })    
        }

        
        render() {
            var pagecount = []
            for (var i = 1; i < this.state.docs.length/4; i++) {
                        pagecount.push(<option key={i-1} value={i*20-1}>{i}</option>)
                }
            console.log(this.state.page);
            const articles = this.state.preview;
          return <div className="parent-wrapper">
                    <Url article={articles} docs={this.state.docs} page={this.state.page} />
                    <select onChange={this.handlePage}>
                    {pagecount}
                    </select>

                </div>;
        }    
    }


    class Url extends React.Component{
            
        constructor(props){

          super(props);

        }

        render(){
           let link = this.props.article;
           let details = this.props.docs
           console.log(link);
            if (link.length>=20) {
                
                return <div className="parent">{link.map((link,index) => 
                        <Linkpreview count={index} link={link} key={index} details={details[index]} />)}
                        

                       </div>;  
                
            }
            return <div>
                    loading...
                   </div>;
        }

    }



    class Linkpreview extends React.Component{
        constructor(props){

            super(props);
            this.HandleClick = this.HandleClick.bind(this);
        }

        HandleClick(props){
            
            document.getElementById(this.props.count).classList.toggle('showhide');
            console.log('hello');
        }

        render(){

        // console.log(this.props.details)
        return (<div className="article">
                    <div className="linkpreview" onClick={this.HandleClick}>
                    <p>{this.props.link.title}</p>
                    <img src={this.props.link.image} height="100px"></img>
                    <p>{this.props.link.description}</p>
                    <a href={this.props.link.url}>{this.props.link.url}</a>
                    </div>
                    <ul id={this.props.count}  style={{display:'none'}}>{JSON.stringify(this.props.details, null, 2)}</ul>
                </div>);
        }

    }

    const container = document.getElementById('container');
    
    ReactDOM.render(<App />, container);
        

}


