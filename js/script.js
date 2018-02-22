function find() {
    // body...
    let month = $('#month').val();
    let year = $('#year').val();

    // $.ajax({
    //     type: "GET",
    //     data: {
    //         "api-key": "577c6c7abfb04fef9d593d84decf7d8e"
    //     },
    //     url: "https://api.nytimes.com/svc/archive/v1/2016/1.json",
    //     success: function(data) {
    //         console.log(data);

    //     }
    // })

    class App extends React.Component {

        render() {

            const text = 
                <div>
                hello there
                </div>

            return text;
        }
    }

    const container = document.getElementById('container');
    
    ReactDOM.render(<App />, container);

}