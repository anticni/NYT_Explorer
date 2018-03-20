import React from 'react';
import Linkpreview from './linkpreview.js';
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

export default Article;