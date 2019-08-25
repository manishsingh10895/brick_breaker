import * as React from 'react';
import logo from '../assets/images/logo.png';
import { RouteComponentProps, withRouter } from 'react-router';
import GameContext, { GameContextType } from './gameContext/GameContext';
import { UserInfo } from './infra/userInfo';

interface IProps extends RouteComponentProps<any> {
    title: string
}

const divStyle = {
    display: 'block'
}

const styles = {
    logo: {
        'display': 'flex',
        'justifyContent': 'center'
    }
}

class StartScreen extends React.Component<IProps> {

    state: UserInfo;

    static contextType = GameContext;

    constructor(props: any) {
        super(props);

        this.state = {
            name: '',
            address: ""
        }
    }

    submit() {
        console.log(this.context);

        this.context.saveUserInfo(this.state);

        this.props.history.push('/gameScreen');
    }

    render() {
        return (
            <GameContext.Consumer>
                {
                    (context: GameContextType) =>
                        <div className="container">
                            {console.log(context)}
                            <div className="logo" style={styles.logo}>
                                <img src={logo} alt="Logo" />
                            </div>

                            <article className="message is-warning">
                                <div className="message-header">
                                    <p>Message</p>
                                </div>
                                <div className="message-body">
                                    Your ethereum address will be used to send you Brick Token,
                                    that you collect in game <br />
                                    Make Sure you enter the right address
                                </div>
                            </article>

                            <div className="card">
                                <div className="card-content">
                                    <div id="user-info" style={divStyle} className="user-info section" >

                                        <div className="field is-horizontal">
                                            <div className="field-label is-normal">
                                                <label className="label">Enter your name: </label>
                                            </div>
                                            <div className="field-body">
                                                <div className="field">
                                                    <p className="control">
                                                        <input onChange={(e) => this.setState({ name: e.target.value })} className="input" type="text" id="name" />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="field is-horizontal">
                                            <div className="field-label is-normal">
                                                <label className="label">Ethereum Address</label>
                                            </div>
                                            <div className="field-body">
                                                <div className="field">
                                                    <p className="control">
                                                        <input id="eth-address" onChange={(e) => this.setState({ address: e.target.value })} placeholder="eth address" className="input" type="text" />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="actions">
                                            <a id="submitAction" className="button is-primary is-outlined" onClick={this.submit.bind(this)}>
                                                Submit
                                            </a>
                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div >
                }
            </GameContext.Consumer>
        )
    }
}

export default withRouter(StartScreen);