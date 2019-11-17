import React, { Component, Fragment } from 'react';

type NavSubMenuProps = {
  menuItems: JSX.Element[];
}

export class NavSubMenu extends Component<NavSubMenuProps> {
    displayName = NavSubMenu.name

  render() {
    return (
    <Fragment>
        {this.props.menuItems.map((element: JSX.Element, i: number) => {
            return React.cloneElement(element, { key: i });
        })}
    </Fragment>
    );
  }
}