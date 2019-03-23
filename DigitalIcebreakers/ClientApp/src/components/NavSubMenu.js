import React, { Component, Fragment } from 'react';

export class NavSubMenu extends Component {
    displayName = NavSubMenu.name

  render() {
    return (
    <Fragment>
        {this.props.menuItems.map((element, i) => {
            return React.cloneElement(element, { key: i });
        })}
    </Fragment>
    );
  }
}