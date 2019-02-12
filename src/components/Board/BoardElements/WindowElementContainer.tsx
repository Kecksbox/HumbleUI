import * as React from 'react';
import { AbsolutePositionedComponent, IAbsolutePositionedComponent, IAbsolutePositionedComponentState } from 'src/components/AbsolutePositionedComponent';
import CssStyleDeclaration from 'src/datatypes/CssDataTypes/CssStyleDeclaration';
import HumbleArray from 'src/datatypes/HumbleArray';
import { IBoardElement, IBoardElementState } from "../BoardElement";
import { WindowElement } from './WindowElement';

interface IWindowElementContainerUserState extends IBoardElementState {
    boardElements: HumbleArray,
}

// make these correct
export function StateInstanceOfIWindowElementContainerUserState(object: AbsolutePositionedComponent<IAbsolutePositionedComponentState>): object is AbsolutePositionedComponent<IWindowElementContainerUserState> {
    return 'boardElements' in object.state;
}

interface IWindowElementContainerUser extends IBoardElement {
    state: IWindowElementContainerUserState,
    resizeChildren(): void,
    getStyleDecleration(): CssStyleDeclaration,
}

// make these correct
export function implementsIWindowElementContainerUser(object: IAbsolutePositionedComponent): object is IWindowElementContainerUser {
    return 'resizeChildren' in object;
}

abstract class WindowElementContainer {

    public static move(windowElementContainerUser: IWindowElementContainerUser, left: number, top: number) {
        // get the parent and calls move on it. Imagine windowElementContainerUser.super.move().
        Object.getPrototypeOf(windowElementContainerUser.constructor).move.call(windowElementContainerUser, left, top);
    }

    public static updateInits(windowElementContainerUser: IWindowElementContainerUser, mode: number = 2): void { // mode is bad style
        Object.getPrototypeOf(windowElementContainerUser.constructor).updateInits.call(windowElementContainerUser, mode);
        const windowElements = windowElementContainerUser.state.boardElements;
        if (mode > 2) {
            for (let i = 0, len = windowElements.data.length; i < len; ++i) {
                windowElements.data[i].updateInits(3);
            }
        }
    }

    public static resizeChildren(windowElementContainerUser: IWindowElementContainerUser) {
        const localWindowElements = windowElementContainerUser.state.boardElements;
        const parentInitValues = windowElementContainerUser.getInitValues();
        const parentDisplayProperties = windowElementContainerUser.state.displayProperties;
        for (const child of localWindowElements) {
            const childInitValues = child.getInitValues();
            child.state.displayProperties.left.setValue((childInitValues.left / parentInitValues.width) * parentDisplayProperties.width.getValue());
            child.state.displayProperties.width.setValue((childInitValues.width / parentInitValues.width) * parentDisplayProperties.width.getValue())
            if (windowElementContainerUser instanceof WindowElement) {
                child.state.displayProperties.top.setValue((childInitValues.top / parentInitValues.height) * parentDisplayProperties.height.getValue());
                child.state.displayProperties.height.setValue((childInitValues.height / parentInitValues.height) * parentDisplayProperties.height.getValue());
            }
            if (implementsIWindowElementContainerUser(child)) {
                child.resizeChildren();
            }
        }
    }

    public static render(windowElementContainerUser: IWindowElementContainerUser): React.ReactNode {
        const id = windowElementContainerUser.getId();
        const boardElements = windowElementContainerUser.state.boardElements;
        return (
            <div key={id} className={this.constructor.name} style={windowElementContainerUser.getInlineStyle()} id={id}>
                {boardElements.render()}
            </div>
        );
    }

    public static renderDomElements(windowElementContainerUser: IWindowElementContainerUser, localStyleDecleration: CssStyleDeclaration, globalStyleDecleration: CssStyleDeclaration): string {
        let result = '';
        for (const child of windowElementContainerUser.state.boardElements.data) {
            result += child.toString(localStyleDecleration, globalStyleDecleration, 1);
        }
        return result;
    }

    public static getStyleDecleration(windowElementContainerUser: IWindowElementContainerUser): CssStyleDeclaration {
        const localDeclaration= windowElementContainerUser.getStyleDecleration();
        // now merge with the ones of the children
        for (const child of windowElementContainerUser.state.boardElements) {
            localDeclaration.unite(child.getStyleDecleration());
        }
        return localDeclaration;
    }


}

export {
    IWindowElementContainerUserState,
    IWindowElementContainerUser,
    WindowElementContainer,
};