import React, {Component} from 'react';

class Goat extends Component{

    constructor(props){
        super(props);
        this.state = {
            showTo: false,
            ShowGoat: false
        }
    }

    componentDidMount(){
        console.log("props");
        /*this.setState({
                showWelcome: true,
                showTo: false,
                fadeGOAT:false
            }
        );*/
        this.timer = setTimeout(_ => {
            this.setState({showTo: true});
            this.timer = setTimeout(() => {
                this.setState({showGOAT: true});
            }, 1000)
        }, 1000)
    }

    render(){
        return(
            <div>
                <h1 id="goatBanner">Welcome {this.handleTo()} {this.handleGOAT()}</h1>
            </div>
        )
    }

    handleTo() {
        if(this.state.showTo){
            return <span id="to">to</span>
        }else{
            return <span id="toWhite">to</span>
        }
    }

    handleGOAT() {
        if(this.state.showGOAT){
            return <span id="goat">G.O.A.T</span>
        }else{
            return <span id="goatWhite">G.O.A.T</span>
        }
    }
}

export default Goat;