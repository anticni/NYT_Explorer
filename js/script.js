function find() {
    // body...
    let month = $('#month').val();
    let year = $('#year').val();

    

    class App extends React.Component {

        constructor(props){

          super(props);
          this.state = {'docs': [], 'preview':[]};
          this.getData = this.getData.bind(this);
          this.onChange = this.onChange.bind(this);
        }

        getData(data) {

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
            success: this.onChange
          })

          }
          this.setState({'docs': docs});
          console.log(this.state.docs)
       
        }

        onChange(response){
    
            var p = this.state.preview;
            p.push(response);
            this.setState({preview: p})
        }

        componentDidMount(){

          $.ajax({
              type: "GET",
              data: {
                  "api-key": "577c6c7abfb04fef9d593d84decf7d8e"
              },
              url: "https://api.nytimes.com/svc/archive/v1/2016/1.json",
              success: this.getData
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
          this.HandleClick = this.HandleClick.bind(this);
        }
        
        HandleClick(){

        }

        render(){
           let link = this.props.article;
           let details = this.props.docs
           console.log(link);
            if (link.length==20) {
                
                return <div>{link.map((link,index) => <Linkpreview link={link} key={index} details={details[index]} />)}</div>;  
                
            }
            return <div>
                    loading...
                   </div>;
        }

    }

    function Linkpreview(props){
        console.log(props.details)
        return (<div>
                    <p>{props.link.title}</p>
                    <img src={props.link.image} height="100px"></img>
                    <p>{props.link.description}</p>
                    <a href={props.link.url}>{props.link.url}</a>
                    <ul>{JSON.stringify(props.details, null, 2)}</ul>
                </div>);
    }

    const container = document.getElementById('container');
    
    ReactDOM.render(<App />, container);
        

}