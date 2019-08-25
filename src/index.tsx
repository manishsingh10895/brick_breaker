import * as React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import GameScreen from './GameScreen';
import StartScreen from './StartScreen';
import PaymentOptions from './payment-options';
import { UserInfo } from './infra/userInfo';
import GameContext from './gameContext/GameContext';

export default class App extends React.Component {

    state = {
        userInfo: { name: '', address: '' },
        saveUserInfo: this.saveUserInfo.bind(this),
        paymentOptionsVisible: false,
        showPaymentOptions: () => { this.setState({ paymentOptionsVisible: true }) },
        hidePaymentOptions: () => { this.setState({ paymentOptionsVisible: false }) }
    }

    constructor(props: any) {
        super(props);
    }

    saveUserInfo(userInfo: UserInfo) {
        console.log(userInfo);
        this.setState({
            userInfo: userInfo
        });
    }

    render() {
        return (
            <GameContext.Provider value={this.state}>
                <Router>
                    <div>
                        <Route path="/" exact component={StartScreen}></Route>
                        <Route path="/gameScreen" component={GameScreen} ></Route>
                    </div>
                </Router>
            </GameContext.Provider>
        )
    }
}


ReactDom.render(
    <App></App>,
    document.getElementById('main')
);