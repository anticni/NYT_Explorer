function find() {
    // body...
    let month = $('#month').val();
    let year = $('#year').val();

    

    class App extends React.Component {

        constructor(props){
          super(props);
          this.state = {'url': []};
          this.getData = this.getData.bind(this);
        }

        getData(data) {
          let url = [];

          for(var i = 0; i < 20; i++) {
            const doc = data.response.docs[i];
            url.push(doc.web_url);            
          }
          this.setState({'url': url});
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
            const articles = this.state.url;
            console.log(articles)
            if (!articles || articles.length==0) {
                return "no Articles to show";
            }
            return <div>{articles.map((article, index) => <Url key={index} url={article} />)}</div>;
        }    
    }
    class Url extends React.Component{
            
            render(){
            return <a href={this.props.url} target="_blank">{this.props.url}</a>;
            }

            componentDidMount(){

                $.ajax({
                    type: "GET",
                    data: {
                        "key": "5a8ebb935fe6d61d084d8e03e1012a86b3635549fe59d",
                        "q": this.props.url
                    },
                    url: "http://api.linkpreview.net/",
                    success: function(data){
                        console.log('hello from linkpreview');
                        console.log(data);
                    }
                })
            }

    }



    const container = document.getElementById('container');
    
    ReactDOM.render(<App />, container);
        

}