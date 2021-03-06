import { isString } from 'lodash';
import chalk from 'chalk';
import redent from 'redent';
import trimNewlines from 'trim-newlines';

import { getContext } from '../context/helpers/manageContext';

import * as labels from './helpers/labels';

export default function initLogLarge(name, version) {
    return {
        info: logger(name, version)('info', 'Info'),
        warn: logger(name, version)('warn', 'Warning'),
        error: logger(name, version)('error', 'Error'),
        success: logger(name, version)('log', 'Success'),
        raw: logger(name, version),
    };
}

function logger(name, version) {
    return (level, label) => {
        const validLevels = ['info', 'warn', 'error', 'log'];
        if (validLevels.indexOf(level) === -1) {
            throw new Error(`The provided level "${level}" is not valid, try one of: ${validLevels.join(', ')}`);
        }

        return (...args) => {
            const message = args[0];
            const title = isString(args[1]) ? args[1] : args[2];
            const error = isString(args[1]) ? args[2] : args[1];

            const log = console[level]; // eslint-disable-line

            log(
    `${labels[level](label, title)}

${trimNewlines(redent(message, 2))}${redent(getError(error), 2)}
  ${getFromWhere(name, version, error)}`
    );
            if (level === 'error') {
                process.exit(process.exitCode || 1); // eslint-disable-line
            }
        };
    };
}

function getFromWhere(name, version, error) {
    const path = error && error.getPath && error.getPath();
    const message = (name ? chalk.bold(name) : '') +
        (version ? chalk.bold(`@${version}`) : '') +
        (path ? ` at ${path}` : '');

    if (message.length === 0) {
        return '';
    }

    return chalk.gray(`\nOccurred in ${message}\n`);
}

function getError(error) {
    if (error && error.message) {
        // Transform Error: XYZ to XYZ for a nicer error message
        // We will only change the error if it is a generic error
        return `\n\n${getContext().verbose ? error.stack : error.toString().replace(/^Error: /, '')}`;
    }

    return '';
}
