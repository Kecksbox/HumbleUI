import * as React from 'react';
import ExportButton from './ExportButton';

class Menu extends React.Component {

    public render() {
        return (
            <div className="layout-menu">
                <ExportButton />
            </div>
        );
    }
    
}

export default Menu;