import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { NavMenu } from './NavMenu';
import Games from '../games/Games';
import { withRouter } from 'react-router-dom';

class Layout extends Component {
    displayName = Layout.name

    render() {
        
        let fullscreen = false;
        if (this.props.currentGame && this.props.location.pathname.indexOf('game/') !== -1) {
            const game = Games().filter(p => p.name === this.props.currentGame)[0];
            if (game && game.fullscreen && !this.props.isAdmin)
                fullscreen = true;
        }
        if (fullscreen)
            return this.props.children;
        else
            return (
                <Grid fluid className="navPad">
                    <Row>
                        <Col sm={3}>
                            <NavMenu {...this.props} />
                        </Col>
                        <Col sm={9}>
                            {this.props.children}
                        </Col>
                    </Row>
                </Grid>
            );
    }
}

export default withRouter(Layout);
