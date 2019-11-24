import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { useSelector } from '../store/useSelector';

export const ConnectionIcon: React.FC = () => {
    const status = useSelector(state => state.connection.status);
    switch (status) {
        case 0: return (<Glyphicon glyph="remove-sign" />);
        case 1: return (<Glyphicon glyph="question-sign" />);
        case 2: return (<Glyphicon glyph="ok-sign" />);
        default: return <span></span>;
    };
};
