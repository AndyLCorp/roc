import expect from 'expect';
import redent from 'redent';
import trimNewlines from 'trim-newlines';
import stripAnsi from 'strip-ansi';

import {
    generateMarkdownDocumentation,
    generateTextDocumentation
} from '../../src/documentation';

describe('roc', () => {
    describe('documentation', () => {
        describe('generateMarkdownDocumentation', () => {
            it('should return empty text string when receiving empty input', () => {
                expect(generateMarkdownDocumentation('roc-test', {
                    settings: {}
                }, {
                    settings: {}
                })).toEqual('No settings available.');
            });

            it('should return a simple markdown table given input', () => {
                expect(generateMarkdownDocumentation('roc-test', {
                    settings: {
                        runtime: {
                            port: 80,
                            enabled: false
                        }
                    }
                }, {
                    settings: {}
                })).toEqual(
                    redent(trimNewlines(`
                        # Settings for \`roc-test\`

                        ## Runtime

                        | Name    | Description | Path            | CLI option | Default | Type      | Required |
                        | ------- | ----------- | --------------- | ---------- | ------- | --------- | -------- |
                        | enabled |             | runtime.enabled | --enabled  | \`false\` | \`Unknown\` | No       |
                        | port    |             | runtime.port    | --port     | \`80\`    | \`Unknown\` | No       |
                        `
                    ))
                );
            });
        });

        describe('generateTextDocumentation', () => {
            it('should return info text when receiving empty input', () => {
                expect(generateTextDocumentation({
                    settings: {}
                }, {
                    settings: {}
                })).toEqual('No settings available.');
            });

            it('should return a simple markdown table given input', () => {
                const table = generateTextDocumentation({
                    settings: {
                        runtime: {
                            port: 80,
                            on: false
                        }
                    }
                }, {
                    settings: {
                        descriptions: {
                            runtime: {
                                port: 'Some really long description string that is over 100 characters long so we ' +
                                'can test the cut off and make sure dots are added',
                                on: 'Short description'
                            }
                        }
                    }
                });
                /* eslint-disable max-len */
                expect(stripAnsi(table)).toEqual(
                    redent(trimNewlines(`
                        runtime

                        | Description                                                                                           | Path         | Default | CLI option | Required |
                        | ----------------------------------------------------------------------------------------------------- | ------------ | ------- | ---------- | -------- |
                        | Short description                                                                                     | runtime.on   | false   | --on       | No       |
                        | Some really long description string that is over 100 characters long so we can test the cut off and … | runtime.port | 80      | --port     | No       |
                        `
                    ))
                );
                /* eslint-enable */
            });
        });
    });
});
