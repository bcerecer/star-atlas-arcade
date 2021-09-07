import React from 'react';
import Dialog from 'material-ui/Dialog';

import styles from '../styles/Info.module.css';

const message = (
    <div>
        <p> Press 'Spacebar' to release bullets</p>
        <p> Use Mouse to move the Spaceship </p>
        <p> Press 'B' to release blaster</p>
        <p> Press 'Enter' to Play/Pause</p>
        <p> Press 'Esc' to close this dialog </p>
    </div>
);

export default class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            score: this.props.score,
            lives: this.props.lives,
            pause: this.props.pause,
            blasters: this.props.blasters,
            livesImage: this.showLives(this.props.lives)
        }
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(newProps)) {
            this.setState({
                score: newProps.score,
                lives: newProps.lives,
                pause: newProps.pause,
                blasters: newProps.blasters,
                livesImage: this.showLives(newProps.lives),
            })
        }
    }

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    showInfo() {
        this.setState({
            open: true,
        })
    }

    showLives(lives) {
        let jsx = [];
        for (let i = 0; i < lives; i++) {
            jsx.push((
                <div key={"lives_" + i}>
                    <img src="../../assets/images/spaceship.png" className={styles.playerImage} alt="P" />
                </div>
            ));
        }
        return jsx;
    }

    render() {
        return (
            <div >
                <div className={styles.leftContent}>
                    <div className={styles.infoChild}>
                        Score: {this.state.score}
                    </div>
                    <div className={styles.infoChild}>Blasters: {this.state.blasters}</div>
                </div>
                <div className={styles.rightContent}>
                    <div className={styles.infoLives}> {this.state.livesImage} </div>
                </div>
                {this.state.pause ? <div className={styles.centerContent}>Press 'Enter' to Play</div> : undefined}
                <Dialog
                    title="Controls"
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    {message}
                </Dialog>
            </div>
        )
    }
}