import React from 'react';
import {Config} from '../config';

const style: React.CSSProperties = {
    float: 'right',
    position: 'absolute',
    right: 0
};

export const GithubFork = () => (
    <a className='githubFork' 
        style={style}
        href="https://github.com/staff0rd/digitalicebreakers"
        target="_blank"
    >
        <img
            width={149}
            height={149}
            src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"
            alt="Fork me on GitHub"
        />
    </a>
);
