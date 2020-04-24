import React, { useState, useCallback, SVGAttributes} from 'react'
import { Text } from 'recharts';

// https://github.com/recharts/recharts/issues/961#issuecomment-618265830

interface Props {
    maxLines: number,
    payload?: { value: string },
    props?: any,
}

export default ({
    maxLines = 3,
    payload,
    ...rest
  }: Props) => {
    const [text, setText] = useState(payload!.value);
    const [suffix, setSuffix] = useState('');
  
    const measuredRef = useCallback(node => {
      if (node === null) {
        return;
      }
  
      let numberOfLines = node.state.wordsByLines.length;
      let tempText = text;
      const tempSuffix = numberOfLines > maxLines ? '…' : '';
  
      while (numberOfLines > maxLines) {
        tempText = tempText.slice(0, -1);
        numberOfLines = node.getWordsByLines({
          ...rest,
          children: tempText + tempSuffix
        }, true).length;
      }
  
      if (tempText !== text) {
        setText(tempText);
        setSuffix(tempSuffix);
      }
    }, [maxLines, rest, text]);
  
    return (
      <g>
        <Text {...rest} ref={measuredRef} fontSize='18px'>
          {text + suffix}
        </Text>
        <title>{payload!.value}</title>
      </g>
    );
  }