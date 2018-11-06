import React, { Component } from 'react';
import { ChromePicker } from 'react-color';
import Checkbox from '@material-ui/core/Checkbox';
import NumberField from './NumberField';
import LineSelect from './LineSelect';

class Info extends Component {
    constructor(props) {
        super();
        this.sketchBoard = props.app.sketchBoard;
    }

    handleColorChange(color, event) {
        this.setState((prevState) => {
            prevState.selected.state.color = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
            return {
                selected: prevState.selected
            }
        });
    }

    handleBorderChange(event) {
        const checked = event.target.checked;
        this.sketchBoard.setState((prevState) => {
            prevState.selected.state.border.checked = checked;
            return {
                selected: prevState.selected
            }
        });

        this.setState({});
    }

    render() {
            if(this.sketchBoard.state.selected === null || this.sketchBoard.state.selected.state.refined === false) {
                return (  
                    <div id="info">
                        <div className="infoItem" id="positioningPresets"></div>
                        <div className="infoItem" id="positioning"></div>
                        <div className="infoItem" id="appearance"></div>
                    </div>  
                );
            } else {
                return (  
                    <div id="info">
                        <div className="infoItem" id="positioningPresets"></div>
                        <div className="infoItem" id="positioning"></div>
                        <div className="infoItem" id="appearance">
                            <div className="header">
                                <h3>APPEARANCE</h3>
                            </div>
                            <div className="colorPicker">
                                <div className="borderControll">
                                    <Checkbox checked={this.sketchBoard.state.selected.state.border.checked} color="default" value="borderChecked" onChange={ this.handleBorderChange.bind(this) }/>
                                    <div className="borderColor"></div>
                                    <p>Border</p>
                                    <div className="picker">
                                        <svg width="24" height="24" viewBox="0 0 24 24">
                                            <path d="M0 0h24v24H0z" fill="none"/>
                                            <path fill="rgba(0, 0, 0, 0.54)" d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"/>
                                        </svg>
                                    </div>
                                    <div className="borderWidth">
                                        <NumberField />
                                    </div>
                                    <div className="lineStyle">
                                        <LineSelect />
                                    </div>
                                </div>
                                <ChromePicker color={ this.sketchBoard.state.selected.state.color } onChange={ this.handleColorChange.bind(this.sketchBoard) } />
                            </div>
                        </div>
                    </div>  
                );
            }
        }
}

export default Info;