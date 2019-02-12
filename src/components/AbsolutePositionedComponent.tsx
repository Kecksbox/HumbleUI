import * as React from 'react';
import App from 'src/App';
import DisplayPropertyCollection from 'src/datatypes/DisplayProperties/DisplayPropertyCollection';
import HumbleArray from 'src/datatypes/HumbleArray';

interface IAbsolutePositionedComponentState {
    displayProperties: DisplayPropertyCollection,
}

interface IAbsolutePositionedComponent {
    state: IAbsolutePositionedComponentState,
    getName(): string,
    getApp(): App,
    getOffset(): Coordinate,
    getActuallleft(): number,
    getActuallTop(): number,
    getCenter(): Coordinate,
    updateInits(mode: number): void,
}

abstract class AbsolutePositionedComponent<S extends IAbsolutePositionedComponentState> extends React.Component<any, S> implements IAbsolutePositionedComponent {
    
    public state: S;

    protected name: string;

    protected app: App;
    
    constructor(app: App, boardElements: HumbleArray = new HumbleArray()) {
        super({});
        this.app = app;
        this.state = this.getInitialState(boardElements);
        this.name = this.getInitalName();
    }

    public getName(): string {
        return this.name;
    }

    public getApp(): App {
        return this.app;
    }

    public abstract updateInits(): void;

    public getActuallleft(): number {
        return this.state.displayProperties.left.getValue();
    }

    public getActuallTop(): number {
        return this.state.displayProperties.top.getValue();
    }

    public getOffset(): Coordinate {
        const localDisplayProperties = this.state.displayProperties;
        return new Coordinate(
            localDisplayProperties.left.getValue(),
            localDisplayProperties.top.getValue(),
        );
    }

    public abstract getCenter(): Coordinate;

    protected abstract getInitialState(boardElements?: HumbleArray): S;

    protected abstract getInitalName(): string;

}

export {
    IAbsolutePositionedComponentState,
    IAbsolutePositionedComponent,
    AbsolutePositionedComponent,
}