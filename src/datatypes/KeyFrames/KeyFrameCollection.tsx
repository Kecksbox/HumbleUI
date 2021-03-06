import {Grid, I3DCoordinate} from '2diminterpulator';
import { IWindowState, Window } from 'src/components/Board/BoardElements/Window';
import { IWindowElementState, WindowElement } from 'src/components/Board/BoardElements/WindowElement';
import { SketchBoard } from 'src/components/Board/SketchBoard';
import { Coordinate } from '../Coordinate';
import DisplayPropertyCollection from '../DisplayProperties/DisplayPropertyCollection';

class KeyFrameCollection {

    private element: WindowElement<IWindowElementState>;

    private window: Window<IWindowState>;

    private collection: Map<Coordinate, DisplayPropertyCollection> = new Map<Coordinate, DisplayPropertyCollection>();

    private functionCache: Map<string, Grid> = new Map<string, Grid>();

    constructor(element: WindowElement<IWindowElementState>, elementID: string) {
        this.element = element;
        this.assignParentWindowById(elementID);
    }

    public add(key: Coordinate, value: DisplayPropertyCollection) {
        const clonedValue = value.clone();
        this.addToCollection(key, clonedValue);
        this.addToGrids(key, clonedValue);
    }

    public mapCurrentFrame() {
        const currentFrameState = new Coordinate(
            this.window.state.displayProperties.width.getValue(),
            this.window.state.displayProperties.height.getValue(),
        )
        this.add(
            currentFrameState,
            this.element.state.displayProperties.clone(),
        );
    }

    public init() {
        this.collection.clear();
        this.mapCurrentFrame();
        this.mapZeroFrame();
        console.log(this);
    }

    public getResponseFunctionForProperty(propertyKey: string): Grid {
        if (this.functionCache[propertyKey] === undefined) {
            this.createResponseFunction(propertyKey);
        }
        return this.functionCache[propertyKey];
    }

    public getKeyCoordinates() {
        const data = [];
        for(const keyFrame of this.collection) {
            data.push(keyFrame[0])
        }
        return data;
    }

    private mapZeroFrame() {
        const displayPropertiesClone = this.element.state.displayProperties.clone();
        displayPropertiesClone.width.setValue(0);
        displayPropertiesClone.left.setValue(0);
        this.add(
            new Coordinate(
                0,
                0,
            ),
            displayPropertiesClone,
        );
        this.add(
            new Coordinate(
                0,
                1080,
            ),
            displayPropertiesClone,
        );
    }

    private createResponseFunction(propertyKey: string) {
        const data = new Array<I3DCoordinate>();
        for (const keyFrame of this.collection) {
            data.push({
                x: keyFrame[0].x,
                y: keyFrame[0].y,
                z: keyFrame[1][propertyKey].getValue(),
            });
        }
        this.functionCache[propertyKey] = new Grid(data);
    }

    private assignParentWindowById(elementID: string) {
        const sketchBoard = SketchBoard.getInstance();
        const window = sketchBoard.findElementById(sketchBoard, elementID[0]);
        if (window == null || window instanceof Window === false) {
            throw new EvalError("Every WindowElement should live in a Window.")
        }
        this.window = window as Window<IWindowState>;
    }

    private addToCollection(key: Coordinate, value: DisplayPropertyCollection) {
        console.log('altering collection with');
        console.log(value.height.getValue());
        for (const keyFrame of this.collection) {
            if (keyFrame[0].x === key.x && keyFrame[0].y === key.y) {
                this.collection.set(keyFrame[0], value);
                return;
            }
        }
        this.collection.set(key, value);
    }

    private addToGrids(key: Coordinate, value: DisplayPropertyCollection) {
        for (const propertyKey in this.functionCache) {
            if (this.functionCache.hasOwnProperty(propertyKey) && value.hasOwnProperty(propertyKey)) {
                const grid: Grid = this.functionCache[propertyKey];
                grid.add({
                    x: key.x,
                    y: key.y,
                    z: value[propertyKey].getValue(),
                })
            }
        }
    }

}

export default KeyFrameCollection;