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






        




    const root = document.getElementById('root');
    
    ReactDOM.render(<App />, root);

