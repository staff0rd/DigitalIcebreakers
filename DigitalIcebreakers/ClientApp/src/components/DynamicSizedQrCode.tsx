import React, { useState, useEffect, useCallback } from "react";
import { Events } from '../Events';
var QRCode = require('qrcode.react');

interface DynamicSizedQrCodeProps {
    qrCodeStyle: React.CSSProperties;
    joinUrl: string;
    parent: React.RefObject<HTMLDivElement>;
    widthFunction?: () => number;
}

export const DynamicSizedQrCode: React.FC<DynamicSizedQrCodeProps> = (props) => {
    const [qrCodeWidth, setQrCodeWidth] = useState<number>(256);

    const resize = useCallback(() => {
        if (props.widthFunction) {
            setQrCodeWidth(props.widthFunction());
        } else if (props.parent.current) {
            if (props.parent.current.clientWidth > props.parent.current.clientHeight) {
                setQrCodeWidth(props.parent.current.clientHeight - 100);
            }
            else {
                setQrCodeWidth(props.parent.current.clientWidth - 100);
            }
        }
    }, [props]);

    useEffect(() => {
        resize();
    }, [resize]);

    useEffect(() => {
        Events.add('onresize', 'qrcode', resize);
        return () => Events.remove('onresize', 'qrcode');
    }, [props.widthFunction, props.parent, resize]);
    return (
        <QRCode value={props.joinUrl} size={qrCodeWidth} renderAs="svg" style={props.qrCodeStyle} />
    );
}