import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import Info from '../../components/Info';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import styles from '../../styles/GamePlay.module.css';

const bulletSpeedInterval = 50;
const bulletSpeedSize = 10;
const enemiesThrowInterval = 500;
const enemiesSpeedInterval = 100;
const enemiesSpeedSize = 10;
const numberOfBlasters = 3;

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pause: true,
            playerStyle: {
                left: 0
            },
            bulletX: [],
            bulletY: [],
            enemiesX: [],
            enemiesY: [],
            aliveEnemies: [],
            enemyCount: 0,
            score: 0,
            lives: 3,
            gameOver: false,
            snackBarOpen: false,
            numberOfBlasters,
            shipImage: 'spaceship.png',
            playerName: null,
        }

    }

    componentDidMount() {
        this.fire();
        this.setState({
            bottom: this.getBoundaries().bottom - 120
        });
        this.refs.mainContainer.focus();
    }

    getBoundaries() {
        let rectCoordinates = this.refs.gameRegion.getBoundingClientRect();
        return rectCoordinates;
    }

    fire() {
        setInterval(() => {
            if (!this.state.pause)
                this.updatebulletY();
        }, bulletSpeedInterval);

        setInterval(() => {
            if (!this.state.pause)
                this.generateEnemies();
        }, enemiesThrowInterval)

        setInterval(() => {
            if (!this.state.pause)
                this.updateEnemiesY();
        }, enemiesSpeedInterval);
    }

    generateBullet(x = -1) {
        x = x === -1 ? this.state.playerStyle.left : x;
        let { bulletX, bulletY } = this.state;
        let { bottom } = this.getBoundaries();
        bulletX.push(x + 10);
        bulletY.push(bottom - 120);
        this.setState({ bulletX, bulletY });
    }

    generateEnemies() {
        let { enemiesX, enemiesY, enemyCount, aliveEnemies } = this.state;
        let width = Math.floor(this.getBoundaries().width);
        width = width - 50;
        enemiesX.push(Math.floor(Math.random() * width) + 1);
        enemiesY.push(0);
        aliveEnemies.push(1);
        enemyCount++;
        this.setState({ enemiesX, enemiesY, enemyCount });
    }

    mouseMove(event) {
        if (!this.state.pause) {
            let { left, width } = this.getBoundaries();
            width = width - 30;
            let x = event.clientX - left;
            if (x < width) {
                this.setState({
                    playerStyle: { left: x }
                })
            }
        }
    }

    updatebulletY() {
        let { bulletY, bulletX, enemiesX, enemiesY, enemyCount, aliveEnemies, score } = this.state;
        for (let i = 0; i < bulletY.length; i++) {
            if (bulletY[i] > -bulletSpeedSize) {
                bulletY[i] = bulletY[i] - bulletSpeedSize;
                let bx = bulletX[i];
                let by = bulletY[i];
                for (let j = 0; j < enemiesX.length; j++) {
                    let ex = enemiesX[j];
                    let ey = enemiesY[j];

                    if (aliveEnemies[j] === 1 && (bx >= ex) && (bx - ex) <= 50 && Math.abs(by - ey) <= 10) {
                        bulletY[i] = -bulletSpeedSize;
                        enemiesY[j] = this.state.bottom + enemiesSpeedSize;
                        aliveEnemies[j] = 0;
                        // console.log(`Enemy ${i} dying`);
                        enemyCount--;
                        score++;
                    }
                }
            }
        }
        this.setState({ bulletY, enemiesY, enemyCount, score, aliveEnemies });
    }

    updateEnemiesY() {
        let { enemiesY, enemiesX, playerStyle, bottom, lives } = this.state;
        for (let i = 0; i < enemiesY.length; i++) {
            if (enemiesY[i] > -enemiesSpeedSize) {
                enemiesY[i] = enemiesY[i] + enemiesSpeedSize;
                // Check if it collides with spaceship
                let ex = enemiesX[i];
                let ey = enemiesY[i];
                let px = playerStyle.left;
                if (ey <= bottom - 10 && ey > bottom - 20 && Math.abs(ex - px) <= 60) {
                    this.showShipBlast();
                    this.gamePause();
                    lives--;
                    this.setState({
                        lives: lives,
                        snackBarOpen: true,
                    });
                    if (lives <= 0) {
                        this.gameOver();
                    }
                }
            }
        }
        this.setState({ enemiesY });
    }

    createBullet(index, left, top) {
        return (
            <div key={`bullet_${index}`} style={{ position: 'absolute', left, top, alignContent: 'center' }} >
                <img src="../../assets/images/bullet.png" alt="b" />
            </div>
        )
    }

    renderBullets() {
        return this.state.bulletX.map((value, index, array) => {
            let top = ((this.state.bulletY[index]) + "px").toString();
            let left = ((this.state.bulletX[index]) + "px").toString();
            let bulletYIndex = this.state.bulletY[index];
            if (bulletYIndex > 0) {
                return this.createBullet(index, left, top);
            } else {
                return undefined;
            }
        }, this);
    }

    renderEnemies() {
        let { bottom, aliveEnemies } = this.state;
        return this.state.enemiesX.map((value, index, array) => {
            let top = (this.state.enemiesY[index] + "px").toString();
            let left = (value + "px").toString();
            let enemiesYIndex = this.state.enemiesY[index];
            if (enemiesYIndex < bottom) {
                if (aliveEnemies[index] === 1) {
                    return (
                        <div key={`enemy_${index}`} style={{ position: 'absolute', left: left, top: top, alignContent: 'center' }}>
                            <img src="../../assets/images/asteroid.png" width="50px" alt='asteroid' />
                        </div>
                    )
                }
            }
            else if (aliveEnemies[index] === 1 && enemiesYIndex >= bottom) {
                aliveEnemies[index] = 0;
                this.setState({
                    aliveEnemies,
                })
            }
        }, this);
    }

    gameOver() {
        console.log("Game over");
        this.setState({
            gameOver: true,
        })
        this.gamePause();
        if (window.confirm("Press OK to Restart or Cancel to Close")) {
            console.log("Wants to restart....");
						<Link href="/"></Link>
        } else {
            console.log("Close the window");
            window.close();
        };
    }


    showShipBlast(blast = true) {
        let img = blast ? "blast.gif" : "spaceship.png";
        this.setState({
            shipImage: img
        })
        if (blast) {
            setTimeout(() => {
                this.showShipBlast(false);
            }, 1500)
        }

    }

    gamePause() {
        console.log("GamePause called");
        if (!this.state.gameOver) {
            this.setState({
                pause: !this.state.pause,
            })
        } else {
            this.setState({
                pause: true
            });
        }
    }

    renderPlayButton() {
        if (!this.state.gameOver) {
            if (this.state.pause) {
                return <span>Play</span>;
            } else {
                return <span>Pause</span>;
            }
        } else {
            return <span>Restart</span>;
        }
    }

    releaseBlaster() {
        let { numberOfBlasters } = this.state;
        if (numberOfBlasters > 0) {
            let { width } = this.getBoundaries();
            width = width - 30;
            for (let i = 0; i < width; i += 10) {
                this.generateBullet(i);
            }
            numberOfBlasters--;
            this.setState({
                numberOfBlasters
            })
        } else {
            console.log("Blaster Stock Empty");
        }
    }

    keyPress(event) {
        this.setState({ snackBarOpen: false });
        if (event.which === 13) {
            // Enter was pressed
            this.gamePause();
        }
        else if (!this.state.pause) {
            if (event.which === 32) {
                this.generateBullet();
            }
            if (event.which === 98) {
                // "B" key was pressed to release Blaster
                this.releaseBlaster();
            }
        }
    }

    render() {
        return (
					<MuiThemeProvider key="themeProvider">
							<div className={styles.container} key="container">
									<div className={styles.mainContainer} ref="mainContainer" tabIndex="0" onKeyPress={this.keyPress.bind(this)}>
											<div className={styles.main}>
													<div className={styles.gameRegion} ref="gameRegion" onMouseMove={this.mouseMove.bind(this)}>
															<div key="gameRegionDiv" style={{ position: "relative" }}>
																	<Info key="infoComponent" 
																			score={this.state.score} 
																			lives={this.state.lives} 
																			pause={this.state.pause} 
																			blasters={this.state.numberOfBlasters} 
																	/>
																	{this.renderBullets()}
																	{this.renderEnemies()}
															</div>
															<div ref="playerRegion" className={styles.playerRegion} >
																	<div ref="player" className={styles.player} style={{ alignContent: 'center', left: (this.state.playerStyle.left + "px").toString() }}>
																			<img src={"../../assets/images/" + this.state.shipImage} className="playerImage" alt="P" />
																	</div>
															</div>
															<Snackbar
																	open={this.state.snackBarOpen}
																	message="Spaceship Blast"
																	autoHideDuration={10000}
																	onRequestClose={
																			() => {
																					this.setState({
																							snackBarOpen: false,
																					});
																			}}
															/>
													</div>
											</div>
									</div>
							</div>
					</MuiThemeProvider>
        )
    }
}