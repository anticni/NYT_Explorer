function find() {
    // body...
    let month = $('#month').val();
    let year = $('#year').val();

    

    class App extends React.Component {

        constructor(props){

          super(props);
          this.state = {'docs': [], 'preview':[]};
          this.getArchive = this.getArchive.bind(this);
          this.getPreview = this.getPreview.bind(this);
        }

        getArchive(data) {

          let docs = [];
          for(var i = 0; i < 20; i++) {
            const doc = data.response.docs[i];
            docs.push(doc);

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
          this.setState({'docs': docs});
          console.log(this.state.docs)
       
        }

        getPreview(data){
    
            var p = this.state.preview;
            p.push(data);
            this.setState({preview: p})
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

          const articles = this.state.preview;
          return <div>
                    <Url article={articles} docs={this.state.docs} />
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
            if (link.length==20) {
                
                return <div>{link.map((link,index) => <Linkpreview count={index} link={link} key={index} details={details[index]} />)}</div>;  
                
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

        console.log(this.props.details)
        return (<div className="flex-item">
                    <div className="ArticleBox" onClick={this.HandleClick}>
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


