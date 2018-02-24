function find() {
    // body...
    let month = $('#month').val();
    let year = $('#year').val();

    

    class App extends React.Component {

        constructor(props){

          super(props);
          this.state = {'url': [], 'preview':[]};
          this.getData = this.getData.bind(this);
          this.onChange = this.onChange.bind(this);
        }

        getData(data) {

          let url = [];
          for(var i = 0; i < 20; i++) {
            const doc = data.response.docs[i];
            url.push(doc.web_url);

            $.ajax({
            type: "GET",
            // data: {
            //     "key": "5a8ebb935fe6d61d084d8e03e1012a86b3635549fe59d",
            //     "q": this.props.url
            // },
            url: "http://api.linkpreview.net/?key=123456&q=https://www.google.com",
            success: this.onChange
          })

          }
          this.setState({'url': url});
       
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
                    <Url article={articles} />
                </div>;
        }    
    }


    class Url extends React.Component{
            
        constructor(props){

          super(props);
          this.state = {'preview':[]};
        }
        
        render(){
           let link = this.props.article;
           console.log(link);
            if (link.length==20) {
                
                return <div>{link.map((link,index) => <Linkpreview link={link} key={index} />)}</div>;  
                
            }
            return <div>
                    loading...
                   </div>;
        }

    }

    function Linkpreview(props){
        return (<div>
                    <p>{props.link.title}</p>
                    <img src={props.link.image} height="100px"></img>
                    <p>{props.link.description}</p>
                    <a href={props.link.url}>{props.link.url}</a>
                </div>);
    }

    const container = document.getElementById('container');
    
    ReactDOM.render(<App />, container);
        

}