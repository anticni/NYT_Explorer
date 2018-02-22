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
                return "no Articles to show"
            }
            const text = 
                <div>
                <a href={articles[0]}>{articles[0]} </a>
                </div>;
                debugger;
            return text;
        }
    }




    const container = document.getElementById('container');
    
    ReactDOM.render(<App />, container);

}